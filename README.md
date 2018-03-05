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





# References

 * [Mapexplorer.com](http://maplorer.com/gpx-view/gpx_view.php) - Useful site for visualizing gpx files even if you can't get them to load in Garmin Connect
 * [python-fitparse](https://pypi.python.org/pypi/fitparse/1.0.0) - library reading the (corrupted) .fit file. Note that nowhere was I able to find a library (python or otherwise) that lets you WRITE .fit files. If you come across one, please let me know!
 * [Routes, Tracks, & Waypoints](http://www.globeriders.com/article_pages/article08_RTW/article08_rtw.shtml) - Some notes on the difference between GPX Waypoints, Tracks, and Routes (full disclosure: I don't completely understand the difference).
 * [Chalice Quickstart](http://chalice.readthedocs.io/en/latest/quickstart.html)