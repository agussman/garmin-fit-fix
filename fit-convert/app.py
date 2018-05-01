from chalice import Chalice

import re
from datetime import datetime

from requests_toolbelt.multipart import decoder
from fitparse import FitFile

from pprint import pprint

app = Chalice(app_name='fit-convert')
app.debug = True

def semicircles_to_degrees(semicircle):
    # 2147483648 = 2^31
    return float(semicircle) * ( 180.0 / 2147483648.0 )

def string_to_datetime(txt):
    # 2018-03-01 02:43:52
    return datetime.strptime(txt, '%Y-%m-%d %H:%M:%S')

def datetime_to_string(dt):
    # 2018-03-01T05:04:39.000Z
    return dt.isoformat()+".000Z"


@app.route('/', cors=True)
def index():
    return {'hello': 'AARON2'}

@app.route('/a2')
def index():
    return {'hello': 'This is A2'}

@app.route('/introspect')
def introspect():
    return app.current_request.to_dict()

@app.route('/process', methods=['POST'], cors=True, content_types=['multipart/form-data'])
def index():

    # Dict to populate with passed-in form data
    data = {}

    # Get the content-type
    content_type = app.current_request.to_dict()['headers']['content-type']
    content = app.current_request.raw_body

    multipart_data = decoder.MultipartDecoder(content, content_type)
    for part in multipart_data.parts:
        print("!!!")
        #print(part.content)  # Alternatively, part.text if you want unicode
        print(part.headers)
        #print(part.headers[b'Content-Disposition'])
        #print(part.encoding)
        #print(part.headers[b'Content-Disposition'].decode(part.encoding))
        #pprint(part)
        content_disposition = part.headers[b'Content-Disposition'].decode(part.encoding)
        cd = [x.strip() for x in content_disposition.split(';')]
        print(cd[1])
        m = re.match('name="(.*)"', cd[1])
        if m is None:
            #TODO: Throw a proper error!
            print("Unable to extract name= from header Content-Disposition")
            exit()
        name = m.group(1)

        if name == "fileItem":
            print("DO STUFF WITH FILE")
            fitfile = FitFile(part.content)
            data[name] = fitfile
            # Extract filename
            n = re.match('filename="(.*)"', cd[2])
            if n is None:
                # TODO Throw a proper warning
                print("WARNING: Problem extracting filename")
                data['filename'] = "download.gpx"
            else:
                # use filename in the output filename
                data['filename'] = "{}.gpx".format(n.group(1))
        else:
            data[name] = part.content
            print("data value {} = {}".format(name, part.content))


    #pprint(data)

    points = []

    try:
        # Get all data messages that are of type record
        for record in fitfile.get_messages('record'):
            datum = {}
            # Go through all the data entries in this record
            for record_data in record:
                # Print the records name and value (and units if it has any)
                if record_data.units:
                    #print(" * %s: %s %s" % (
                    #    record_data.name, record_data.value, record_data.units,
                    #))
                    datum[record_data.name] = record_data.value
                else:
                    #print(" * %s: %s" % (record_data.name, record_data.value))
                    datum[record_data.name] = record_data.value
            print("TS: {}".format(datum['timestamp']))
            point = {
                'elevation': datum['altitude'],
                #'time': string_to_datetime(datum['timestamp']),
                'time': string_to_datetime("{}".format(datum['timestamp'])),
                'latitude': semicircles_to_degrees(datum['position_lat']),
                'longitude': semicircles_to_degrees(datum['position_long']),
                'heart_rate': datum['heart_rate'],
                'cadence': datum['cadence']
            }
            points.append(point)


    except:
        #with open(gpxfile, 'w') as f:
        #    f.write(gpx.to_xml())
        print('Created GPX:')

    txt = '''<?xml version="1.0" encoding="UTF-8"?>
    <gpx creator="Garmin Connect" version="1.1"
      xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/11.xsd"
      xmlns:ns3="http://www.garmin.com/xmlschemas/TrackPointExtension/v1"
      xmlns="http://www.topografix.com/GPX/1/1"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ns2="http://www.garmin.com/xmlschemas/GpxExtensions/v3">
      <metadata>
        <link href="connect.garmin.com">
          <text>Garmin Connect</text>
        </link>
        <time>2018-03-01T02:34:15.000Z</time>
      </metadata>
      <trk>
        <name>{}</name>
        <type>{}</type>
        <trkseg>
    '''.format(data['fileDescription'], data['pokemonControl'])

    for point in points:
        trkpt = """
          <trkpt lat="{}" lon="{}">
            <ele>{}</ele>
            <time>{}</time>
            <extensions>
              <ns3:TrackPointExtension>
                <ns3:hr>{}</ns3:hr>
                <ns3:cad>{}</ns3:cad>
              </ns3:TrackPointExtension>
            </extensions>
          </trkpt>
        """.format(point["latitude"], point["longitude"], point["elevation"], datetime_to_string(point["time"]), point["heart_rate"], point["cadence"])
        txt += trkpt

    txt += """
        </trkseg>
      </trk>
    </gpx>
    """



    return {'message': txt,
            'filename': data['filename']}


# The view function above will return {"hello": "world"}
# whenever you make an HTTP GET request to '/'.
#
# Here are a few more examples:
#
# @app.route('/hello/{name}')
# def hello_name(name):
#    # '/hello/james' -> {"hello": "james"}
#    return {'hello': name}
#
# @app.route('/users', methods=['POST'])
# def create_user():
#     # This is the JSON body the user sent in their POST request.
#     user_as_json = app.current_request.json_body
#     # We'll echo the json body back to the user in a 'user' key.
#     return {'user': user_as_json}
#
# See the README documentation for more examples.
#
