BUILD IMAGE: docker build --tag unicon/shibuibuilder:1.0 .

USE:
If you want to simple use the existing version, you should be able to pull the image from the unicon docker hub site.
Otherwise, build the image first using the above command.

After building, if you wish to simply execute the build command using the docker-compose file in this folder do:
> docker-compose up

(or add the -d flag to the end if you don't wish to view the build output)

The container will stop once the gradle build command has completed.

If you wish to keep the docker container running for use as a build env, comment out the environment section of the 
docker-compose file and then start the container and docker exec into the running container to perform whatever build
tasks you desire.

You can also alter the default "build" target in the docker-compose file as needed. 