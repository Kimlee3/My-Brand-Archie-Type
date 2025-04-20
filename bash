npm install gh-pages --save-dev
# package.json에 추가:
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
