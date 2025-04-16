#######################
    Python Flask App
#######################

Requires pip install pyinstaller to create an executable Flask app which is used by the Electron app:
"pyinstaller -F --contents-directory backend --workpath backend/build --distpath backend/dist --workpath backend backend/app.py"

To run locally use the following command while in the projects root directory:
"flask --app backend/app run --debug"

##########################
    Electron Functions
##########################
To install dependency packages run the following command:
"npm install"

Uses electron-forge to create an executable:
"npm run make"

Use "npm start" to run locally

##########################
    Tech dependencies
##########################
Visual Studio (was getting an error with node-gyp not building due to missing this)
Python
NodeJs
git