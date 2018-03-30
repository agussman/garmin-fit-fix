from chalice import Chalice

import re

from requests_toolbelt.multipart import decoder


from pprint import pprint

app = Chalice(app_name='fit-convert')
app.debug = True

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
            data[name] = "<PLACEHOLDER>"
        else:
            data[name] = part.content


    pprint(data)



    return {'message': 'You called process'}


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
