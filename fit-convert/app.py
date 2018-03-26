from chalice import Chalice
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
    req = app.current_request.json_body
    pprint(req)
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
