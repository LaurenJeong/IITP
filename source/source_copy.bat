@echo off 

rem QuickCodeDemo �������ϻ���  
echo QuickCodeDemo �������ϻ��� 
rmdir /s C:\apache-tomcat-8.5.83\webapps\ROOT\WEB-INF\files\QuickCodeDemo

rem ������Ʈ ���� ��� 
echo ���� ���� 
mkdir C:\apache-tomcat-8.5.83\webapps\ROOT\WEB-INF\files\QuickCodeDemo 
xcopy .\QuickCodeDemo\*.* C:\apache-tomcat-8.5.83\webapps\ROOT\WEB-INF\files\QuickCodeDemo\ /e /h

pause 