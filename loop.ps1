$progressPreference = 'silentlyContinue' 

while($true)
{
    #'Quering for PM25...'
    $pm25 = (Invoke-WebRequest -Uri http://localhost:3005/pm25 -UseBasicParsing).Content / 10
    'PM25: ' + $pm25
    (Invoke-WebRequest -Uri http://localhost:3008/set/$pm25/0/1 -UseBasicParsing).Content
    Start-Sleep -Seconds 3
}