from main import app
app.secret_key = "donttellnobodywatdisisitsSECRET"

if __name__ == "__main__":
    app.run(debug=True)
