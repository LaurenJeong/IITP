@echo off 

rem QuickCodeDemo 기존파일삭제  
echo QuickCodeDemo 기존파일삭제 
rmdir /s C:\apache-tomcat-8.5.83\webapps\ROOT\service\source\QuickCodeDemo

rem 프로젝트 파일 백업 
echo 파일 복사 
mkdir C:\apache-tomcat-8.5.83\webapps\ROOT\service\source\QuickCodeDemo 
xcopy .\QuickCodeDemo\*.* C:\apache-tomcat-8.5.83\webapps\ROOT\service\source\QuickCodeDemo\ /e /h

pause 