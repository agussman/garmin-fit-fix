# Overview

Fix corrupted Garmin `.fit` files via an AWS Lambda service that converts them into `.gpx` format. The service is written in Python 3 and we'll use AWS Chalice to deploy.

# Baseline Environment Setup

Before we get started, make sure you've got your AWS credentials setup correctly.

Chalice will balk if you're not running (at least) Python 3.6, which means I need to yolo and update my machine's Python 3.5 install. On OSX this is pretty straightforward:
```
$ brew upgrade python3
```

This broke virtualenvwrapper, so I had to update `pip` and `virtualenvwrapper`:
```
$ pip install --upgrade pip
$ pip3 install --upgrade virtualenvwrapper
```

We'll mostly be following the steps in the [Chalice Quickstart](http://chalice.readthedocs.io/en/latest/quickstart.html), only we'll be using `virtualenvwrapper` because we are not plebes. 

Make sure you have Node.js and `npm` installed:
```
$ brew install npm
```


# Chalice Setup

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
it means you attempted to access a non-existant endpoint (check for a typos in the URL)


# Testing it out

Run chalice locally:
```
$ chalice local
Serving on 127.0.0.1:8000
```

hit the end point:
```
$ curl 127.0.0.1:8000
{"hello": "AARON2"}
```

For development purposes, we'll want to add `cors=True` to the API endpoints (this is not something we want in production)
```
@app.route('/', cors=True)
```

# Angular Crap

Install Angular 5:
```
$ npm install @angular/cli -g
```

Install stuff:
```
fit-convert-ng5 $ npm install
```


## How I made it:

Create a new Angular 5 project:
```
$ ng new fit-convert-ng5
$ cd fit-convert-ng5/
```

Install Material:
```
$ npm install --save @angular/material @angular/cdk
```

We'll also need the [FileSaver.js](https://github.com/eligrey/FileSaver.js/):
```
$ npm install --save file-saver
```

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

# Deploying

Normally to build a deployment of an Angular app you do:
```
fit-convert-ng5 $ ng build --prod
```

Install the AWS SDK for npm
```
fit-convert-ng5 $ npm install aws-sdk --save-dev
fit-convert-ng5 $ npm install mime-types --save-dev

```







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
 * [Deploying an Angular App to S3](https://johnlouros.com/blog/uploading-a-angular-app-to-S3-with-npm) <-- probably not doing this
 * [Git-backed static website powered entirely by AWS](https://github.com/alestic/aws-git-backed-static-website)