# Overview

Fix corrupted Garmin `.fit` files via an AWS Lambda service that converts them into `.gpx` format. Crucially, Garmin Connect will actually import it. The service is written in Python 3, with an AWS Lambda backend manged by AWS Chalice, and a front-end written in Angular 5.

The repo contains:
```
 |
 |\_ fit-convert-ng5 : Angular 5 Front-End
 |
 |\_ fit-convert : Python 3 backend, deploying to AWS Lambda with AWS Chalice
 |
  \_ fit-convert.ipynb : Python notebook with code detrius of me figuring out how to do the conversion
```

Note that this README is less about setup/running the project and more akin to a tutorial/blog post about how the code came to be.

# Baseline Environment Setup

You'll need to [install the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/installing.html) for your platform and make sure you've got your [AWS credentials setup](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-quick-configuration) correctly

Chalice will balk if you're not running (at least) Python 3.6, which means I need to yolo and update my machine's Python 3.5 install. On OSX this is pretty straightforward:
```
$ brew upgrade python3
```

This broke virtualenvwrapper, so I had to update `pip` and `virtualenvwrapper`:
```
$ pip install --upgrade pip
$ pip3 install --upgrade virtualenvwrapper
```

Make sure you have Node.js and `npm` installed:
```
$ brew install npm
```


# Chalice Setup

We'll mostly be following the steps in the [Chalice Quickstart](http://chalice.readthedocs.io/en/latest/quickstart.html), only we'll be using `virtualenvwrapper` because we are not plebes. 

Create a virtualenv and install `chalice`:

```
$ which python3.6
/usr/local/bin/python3.6
$ mkvirtualenv --python /usr/local/bin/python3.6 fit-convert
(fit-convert) $ pip install chalice
```
Create a new project:
```
$ chalice new-project fit-convert
```

As you're going through the intro, if you get a message like:
```
{
    "message": "Missing Authentication Token"
}
```
it means you attempted to access a non-existent endpoint (check for a typos in the URL)

## Testing out Chalice

I made a change to `index()` in `app.py`.

Run chalice locally:
```
$ chalice local
Serving on 127.0.0.1:8000
```

Hit the end point to confirm it works:
```
$ curl 127.0.0.1:8000
{"hello": "AARON2"}
```

For development purposes, we'll want to add `cors=True` to the API endpoints (this is not something we want in production)
```
@app.route('/', cors=True)
```

# Angular Setup

Install Angular 5:
```
$ npm install @angular/cli -g
```

Install stuff:
```
fit-convert-ng5 $ npm install
```

Create a new Angular 5 project:
```
$ ng new fit-convert-ng5
$ cd fit-convert-ng5/
```

## Angular Development

Install Material:
```
$ npm install --save @angular/material @angular/cdk
```

We'll also need the [FileSaver.js](https://github.com/eligrey/FileSaver.js/):
```
$ npm install --save file-saver
```

_<DEPRECATED>_

Create an `Activity` class:
```
$ ng generate class Activity

```
 
We populate `activity.ts` with some basic parameters of type `string`:
```typescript
export class Activity {

    constructor(
        public title: string,
        public activityType: string
    ) {  }
}
```

Next create an `ActivityForm`:
```
$ ng generate component ActivityForm
```

<Put stuff in ActivityForm>

_</DEPRECATED>_

Create an `ActivityService`:
```
$ ng generate service ActivityService
  create src/app/activity-service.service.spec.ts (429 bytes)
  create src/app/activity-service.service.ts (121 bytes)
```

Note that the `HttpModule` aka `@angular/core` is now deprecated; you should use `HttpClient` from `@angular/common/http` instead. Unfortunately a lot of the documentation still uses the old library and the look similar enough that it's not immediately obvious.

Updating the chalice app.py to parse `multipart/form-data` was quite a doozy. It seems like it should be really straightforward
a thing that a library just exists for, but it wasn't!

Angular can't actually interact with the file `<input>` in an angular-ly way and it's annoying. You can't rely on a lot of the bakedi-n angular 
goodness (e.g. form validity) to work with it.

# Testing Locally

Run the backend with:
```
(fit-convert) fit-convert $ chalice local
```

Run the frontend with:
```
fit-convert-ng5 $ ng serve
```

Check at http://localhost:4200/

# Configuration and Deployment

We're going to deploy the Angular frontend to S3 as a static website. The backend will be deployed with chalice. There's a slight "chicken and the egg" dependency between the two. We need to know the API Gateway url to set `apiRoot` in our front-end. But, to successfully enable CORS on the backend, we need to know the front-end URL (either an S3 bucket url, or our own custom domain).

We will deploy chalice by running `chalice deploy`. A successful chalice deployment will look like:
```
(fit-convert) fit-convert $ chalice deploy
Regen deployment package.
Updating IAM policy for role: fit-convert-dev
Updating lambda function: fit-convert-dev
API Gateway rest API already found: md5ishstring
Deploying to API Gateway stage: api
https://md5ishstring.execute-api.us-east-1.amazonaws.com/api/
```

Some things to watch out for:

A failure to deploy will likely give you a cryptic message, possibly not even indicating a failure occurred _[I think this has been fixed in newer versions]_:
```
(fit-convert) fit-convert $ chalice deploy
Regen deployment package.
'data'
```
This could be caused by having two functions with the same name (shoutout to `chalice local` that will still run without balking).

Generally, `chalice local` is awesome, but there are situations where it is able to serve content that will fail when you actually `chalice deploy` to AWS. A reasonable starting point for debugging would be to assume the error has something to do with APIGateway.

* If you get a `502` error and a `{"message": "Internal server error"}` response, it's possibly an error with serializing the response to JSON (e.g., it can't).
* APIGateway can be wonky with binary data. I had to tell chalice that `multipart/form-data` was binary by setting `app.api.binary_types`.
* Check for error logs under [Cloudwatch](https://console.aws.amazon.com/cloudwatch/). 

Next we will deploy our frontend to S3 as a static site.

First we need to create an S3 bucket for this purpose and configure it for static website hosting ([see Steps 1-2 here](https://docs.aws.amazon.com/AmazonS3/latest/dev/HostingWebsiteOnS3Setup.html)). If you are using a custom domain, follow [these instructions](https://docs.aws.amazon.com/AmazonS3/latest/dev/website-hosting-custom-domain-walkthrough.html) to host a static S3 site using your own url (this is the route I went: [fit-converter.com](fit-converter.com).

We'll also want to update the production configuration of the app by setting the `apiRoot` in `environment.prod.ts` to the endpoint created by Chalice. This allows us to run the app locally with `chalice local` without the need to for making code changes to the URL when we're ready to deploy. The `environment.prod.ts` file should look like:
```
export const environment = {
  production: true,
  apiRoot: 'https://md5ishstring.execute-api.us-east-1.amazonaws.com/api/'
};
```

If you're like me and you feel that it is, to use technical jargon, "sketchy" to post a URL like that to a public git repo, you can ignore changes to this file with:
```
$ git update-index --assume-unchanged src/environments/environment.prod.ts
```
Note that this is different than updating `.gitignore` and removing it from cache, because the file will continue to persist in your repo.

Next, build a deployment/production version of the Angular app:
```
fit-convert-ng5 $ ng build --prod --aot
```

This can then be copied to our S3 bucket with (you may need to do this from your virtualenv):
```
$ aws s3 sync --acl public-read --delete ./dist/ s3://my-domain.com
```

Lastly, we'll want to go back to our `app.py` and update the CORS settings so that only requests from our S3 URL / personal domain are accepted. We do this my creating a custom `CORSConfig` (replace `my-domain.com` with your custom URL or the URL of your public S3 bucket):
```python
from chalice import Chalice, CORSConfig

...

cors_config = CORSConfig(
    allow_origin='http://my-domain.com',
)

...

@app.route('/process', methods=['POST'], cors=cors_config, content_types=['multipart/form-data'])
def index3():
    ...
    
```

And then redeploy with `chalice deploy`.









# References

 * [Mapexplorer.com](http://maplorer.com/gpx-view/gpx_view.php) - Useful site for visualizing gpx files even if you can't get them to load in Garmin Connect
 * [python-fitparse](https://pypi.python.org/pypi/fitparse/1.0.0) - library reading the (corrupted) .fit file. Note that nowhere was I able to find a library (python or otherwise) that lets you WRITE .fit files. If you come across one, please let me know!
 * [Routes, Tracks, & Waypoints](http://www.globeriders.com/article_pages/article08_RTW/article08_rtw.shtml) - Some notes on the difference between GPX Waypoints, Tracks, and Routes (full disclosure: I don't completely understand the difference).
 * [Chalice Quickstart](http://chalice.readthedocs.io/en/latest/quickstart.html)
 * [Angular 5 Forms](https://angular.io/guide/forms)
 * [Angular 5 Core HTTP API](https://codecraft.tv/courses/angular/http/core-http-api/#_post_with_data) - Example of how to actually submit a form to an API
 * [AWS Serverless Demo App](https://github.com/awslabs/aws-serverless-workshops/tree/master/WebApplication)
 * [Useful help on using HttpClient over deprecated Http service](http://brianflove.com/2017/07/21/migrating-to-http-client/)
 * [Angular 5 Services](http://devarea.com/angular-5-services/) - Examples of creating a Service around `HttpClient`
 * [File Upload with Angular](https://www.codingforentrepreneurs.com/blog/file-upload-with-angular/) - Good architectural overview of how to set this up, but the code was _riddled_ with errors that were difficult to debug as a neophyte
 * [Parsing multipart/form-data with Chalice](https://stackoverflow.com/questions/45136349/parsing-raw-body-from-aws-chalice-multipart-form-data-http-request)
 * [Simple FileSaver.js example](https://shekhargulati.com/2017/07/16/implementing-file-save-functionality-with-angular-4/)
 * [More in-depth use of FileSaver.js with Angular](http://amilspage.com/angular4-file-download/)
 * [Getting the Twitter and GitHub icons to work](https://materialdesignicons.com/getting-started)
 * [Posting multipart/form-data to APIGateway](https://stackoverflow.com/questions/41756190/api-gateway-post-multipart-form-data)
 * [Hosting a static website on AWS S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/HostingWebsiteOnS3Setup.html)
 * [Ultimate Guide to Deploying Static Sites on AWS](https://stormpath.com/blog/ultimate-guide-deploying-static-site-aws)
 * [Deploying an Angular App to S3](https://johnlouros.com/blog/uploading-a-angular-app-to-S3-with-npm) <-- probably not doing this
 * [Git-backed static website powered entirely by AWS](https://github.com/alestic/aws-git-backed-static-website)
 * [Continuous Delivery to S3 via CodePipeline and Codebuild](https://stelligent.com/2017/09/05/continuous-delivery-to-s3-via-codepipeline-and-codebuild/)s