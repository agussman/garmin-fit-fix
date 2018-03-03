# Overview

Fix corrupted Garmin `.fit` files via an AWS Lambda service that converts them into `.gpx` format. The service is written in Python 3 and we'll use AWS Chalice to deploy.

# References

 * [Mapexplorer.com](http://maplorer.com/gpx-view/gpx_view.php) - Useful site for visualizing gpx files even if you can't get them to load in Garmin Connect
 * [python-fitparse](https://pypi.python.org/pypi/fitparse/1.0.0) - library reading the (corrupted) .fit file. Note that nowhere was I able to find a library (python or otherwise) that lets you WRITE .fit files. If you come across one, please let me know!
 * [Routes, Tracks, & Waypoints](http://www.globeriders.com/article_pages/article08_RTW/article08_rtw.shtml) - Some notes on the difference between GPX Waypoints, Tracks, and Routes (full disclosure: I don't completely understand the difference).
 * [Chalice Quickstart](http://chalice.readthedocs.io/en/latest/quickstart.html]