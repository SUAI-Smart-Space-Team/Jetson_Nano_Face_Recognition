REGISTRY 		:= smartspace
NAME 			:= storage
#VERSION 		:= 0.0.2

BASE_IMAGE 		:= ${REGISTRY}/${NAME}
VERSION_IMAGE   := ${BASE_IMAGE}:${VERSION}
#BRANCH_IMAGE    := ${VERSION_IMAGE}-$(BRANCH) 

#BRANCH := main

image:
	docker build -f ${FILE} -t ${BASE_IMAGE} .
	

push:
	docker login -u scherbet -p '0d92f365-316d-4ed8-a491-94247ea877ee'
	docker tag ${BASE_IMAGE} ${VERSION_IMAGE}
	#docker push ${BASE_IMAGE}
	docker push ${VERSION_IMAGE}
	#docker tag ${BASE_IMAGE} ${BRANCH_IMAGE}
	#docker push ${REGISTRY}/${NAME}:${VERSION}-$(BRANCH)
pull:
	docker login -u scherbet -p '0d92f365-316d-4ed8-a491-94247ea877ee'
	docker pull ${REGISTRY}/${NAME}:${VERSION}
