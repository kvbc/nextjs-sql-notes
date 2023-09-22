@ECHO OFF
START "" /D client /MIN CMD /C "npm install && npm run dev"
START "" /D server /MIN CMD /C "npm install && npm start"
ECHO "Please open up http://localhost:3000 in your browser! (keep this process running)"
PAUSE
TITLE kvbc-nextjs-sql-notes
TASKKILL /F /T /FI "WINDOWTITLE eq kvbc-nextjs-sql-notes*"