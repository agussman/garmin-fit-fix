# Overview

Fix corrupted Garmin `.fit` files via an AWS Lambda service that converts them into `.gpx` format. The service is written in Python 3 and we'll use AWS Chalice to deploy.

# Chalice Setup

Before we get started, make sure you've got your AWS credentials setup correctly.


Chalice will balk if you're not running (at least) Python 3.6, which means I need to yolo and update my machine's Python 3.5 install. On OSX this is pretty straightforward:
```
$ brew upgrade python3
```

We'll mostly be following the steps in the [Chalice Quickstart](http://chalice.readthedocs.io/en/latest/quickstart.html), only we'll be using `virtualenvwrapper` because we are not plebes. Note: I'm using Python 3.5 because that's what I have on my machine and I don't feel like messing around with an upgrade at the moment, but be aware that Lambda supports/runs Python 3.6.

Create a virtualenv and install `chalice`:

```
$ which python3
/usr/local/bin/python3
$ mkvirtualenv --python /usr/local/bin/python3 fit-convert
(fit-convert) $ pip install chalice
```




# References

 * [Mapexplorer.com](http://maplorer.com/gpx-view/gpx_view.php) - Useful site for visualizing gpx files even if you can't get them to load in Garmin Connect
 * [python-fitparse](https://pypi.python.org/pypi/fitparse/1.0.0) - library reading the (corrupted) .fit file. Note that nowhere was I able to find a library (python or otherwise) that lets you WRITE .fit files. If you come across one, please let me know!
 * [Routes, Tracks, & Waypoints](http://www.globeriders.com/article_pages/article08_RTW/article08_rtw.shtml) - Some notes on the difference between GPX Waypoints, Tracks, and Routes (full disclosure: I don't completely understand the difference).
 * [Chalice Quickstart](http://chalice.readthedocs.io/en/latest/quickstart.html)