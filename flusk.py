# basic flask setup to serve webpages
import mimetypes
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')

from flask import Flask, render_template, request, redirect, url_for

from flask_cors import CORS, cross_origin


app = Flask(__name__, template_folder="templates", static_folder="static")

CORS(app, supports_credentials=True, origins=["https://oss-aryanroy.dev"])


@app.route("/fysen/website")
def index():
    print(request.cookies)
    return render_template("Homepage.html")

@app.route("/fysen/website/login")
def login():
    print(request.cookies)
    return render_template("login.html")

@app.route("/fysen/website/register")
def register():
    return render_template("signup.html")

@app.route("/fysen/website/about-us")
def about_us():
    return render_template("about.html")

@app.route("/fysen/website/profile")
def profile():
    return render_template("profile.html")

@app.route("/fysen/website/myflights")
def myflights():
    return render_template("myflights.html")

@app.route("/fysen/website/flights")
def flights():
    return render_template("flightList.html")

@app.route("/fysen/website/bookflight")
def book_flight():
    return render_template("booking.html")


if __name__ == "__main__":
    app.run(port=8000)


