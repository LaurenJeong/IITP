@echo off 

rem QuickCodeDemo �������ϻ���  
echo QuickCodeDemo �������ϻ��� 
rmdir /s C:\apache-tomcat-8.5.83\webapps\ROOT\service\source\QuickCodeDemo

rem ������Ʈ ���� ��� 
echo ���� ���� 
mkdir C:\apache-tomcat-8.5.83\webapps\ROOT\service\source\QuickCodeDemo 
xcopy .\QuickCodeDemo\*.* C:\apache-tomcat-8.5.83\webapps\ROOT\service\source\QuickCodeDemo\ /e /h

pause 