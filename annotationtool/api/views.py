from os import stat

from django.core.files.base import ContentFile
from django.db.models.expressions import Ref
from django.db.models.fields import files
from django.shortcuts import render
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ProjectModel, ReferenceEntitiesModel
from .serializers import (CreateProjectEntitiesSerializer,
                          CreateProjectSerializer,
                          ProjectEntitiesSerializer, ProjectSerializer,
                          UpdateProjectEntitiesSerializer,
                          AnnotationSubmitSerializer,
                          ProjectDataUploadSerializer)


class ListProjectsView(APIView):
    permission_classes = []
    serializer_class = ProjectSerializer

    def get(self, reuqest, *args, **kwargs):
        serializer = self.serializer_class(
            ProjectModel.objects.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateProjectView(APIView):
    permission_classes = []
    serializer_class = CreateProjectSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Creating new project
        project = serializer.Meta.model(**serializer.validated_data)
        project.save()

        return Response(ProjectSerializer(project).data, status=status.HTTP_201_CREATED)

    def options(self, request, *args, **kwargs):
        """
        Handler method for HTTP 'OPTIONS' request.
        """
        if self.metadata_class is None:
            return self.http_method_not_allowed(request, *args, **kwargs)
        fields = dict()
        for field in self.serializer_class.Meta.model._meta.fields:
            if (field.get_attname() != "") and (field.get_attname() in self.serializer_class.Meta.fields or self.serializer_class.Meta.fields == '__all__'):
                fields[field.get_attname()] = dict(
                    type=field.get_internal_type(),
                    default=field.get_default(),
                    blank=field.blank,
                    choices=field.choices,
                    max_length=field.max_length,
                    verbose_name=field.verbose_name
                )
        data = self.metadata_class().determine_metadata(request, self)
        data['fields'] = fields
        return Response(data, status=status.HTTP_200_OK)


class ProjectDataUploadView(APIView):
    model_class = ProjectModel
    serializer_class = ProjectDataUploadSerializer
    max_file_size = 100*1024

    def post(self, request, pk=None, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Uploading Output data and creating input data
        projects = self.model_class.objects.filter(pk=pk)
        if len(projects) > 0:
            project = projects[0]
            # Upload Input file to the system
            if project.input_data:
                project.input_data.delete(save=True)
            project.input_data = serializer.validated_data['file']
            # Initialize Output JSONL file
            if project.output_data:
                project.output_data.delete(save=True)
            project.output_data = self.initialize_output_file(
                filename="output.jsonl")
            # Saving changes to the database
            project.save(update_fields=['input_data', 'output_data'])

            return Response(data=ProjectSerializer(project).data, status=status.HTTP_200_OK)
        return Response(data={'error': 'Requested project was not found.'}, status=status.HTTP_404_NOT_FOUND)

    def options(self, request, *args, **kwargs):
        """
        Handler method for HTTP 'OPTIONS' request.
        """
        if self.metadata_class is None:
            return self.http_method_not_allowed(request, *args, **kwargs)
        fields = dict(input_data={'max_size': self.max_file_size})
        data = self.metadata_class().determine_metadata(request, self)
        data['fields'] = fields
        return Response(data, status=status.HTTP_200_OK)

    def initialize_output_file(self, filename):
        return ContentFile(content=b"", name=filename)


class ProjectDataView(APIView):
    model_class = ProjectModel

    def get(self, request, pk=None, *args, **kwargs):
        projects = self.model_class.objects.filter(pk=pk)
        if len(projects) > 0:
            project = projects[0]
            input_line_count = project.get_input_data_lines(count=True)
            output_line_count = project.get_output_data_lines(count=True)
            return Response({
                'input_count': input_line_count,
                'output_count': output_line_count
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Requested project was not found.'}, status=status.HTTP_404_NOT_FOUND)


class ProjectDetailView(APIView):
    model_class = ProjectModel
    serializer_class = ProjectSerializer

    def get(self, request, pk=None, *args, **kwargs):
        projects = self.model_class.objects.filter(pk=pk)
        if len(projects) > 0:
            project = projects[0]
            return Response(self.serializer_class(project).data)
        return Response({'error': 'Requested project was not found.'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, pk=None, *args, **kwargs):
        projects = self.model_class.objects.filter(pk=pk)
        if len(projects) > 0:
            project = projects[0]
            serializer = self.serializer_class(project, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'Requested project was not found.'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk=None, *args, **kwargs):
        projects = ProjectModel.objects.filter(id=pk)
        if len(projects) > 0:
            project = projects[0]
            project.delete()
            return Response(ProjectSerializer(project).data, status=status.HTTP_200_OK)
        return Response({'error': 'Requested project was not found.'}, status=status.HTTP_404_NOT_FOUND)

    def options(self, request, *args, **kwargs):
        """
        Handler method for HTTP 'OPTIONS' request.
        """
        if self.metadata_class is None:
            return self.http_method_not_allowed(request, *args, **kwargs)
        fields = dict()
        for field in self.serializer_class.Meta.model._meta.fields:
            if (field.get_attname() != "") and (field.get_attname() in self.serializer_class.Meta.fields or self.serializer_class.Meta.fields == '__all__'):
                fields[field.get_attname()] = dict(
                    type=field.get_internal_type(),
                    default=field.get_default(),
                    blank=field.blank,
                    choices=field.choices,
                    max_length=field.max_length,
                    verbose_name=field.verbose_name
                )
        data = self.metadata_class().determine_metadata(request, self)
        data['fields'] = fields
        return Response(data, status=status.HTTP_200_OK)


class ProjectEntitiesCreateView(APIView):
    model_class = ReferenceEntitiesModel
    serializer_class = CreateProjectEntitiesSerializer

    def post(self, request, pk=None, *args, **kwargs):
        projects = ProjectModel.objects.filter(pk=pk)
        serializer = self.serializer_class(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)

        if len(projects) > 0:
            project = projects[0]
            entities = []
            for item in serializer.validated_data:
                entity = self.model_class(project=project, **item)
                entity.save()
                entities.append(entity)
            return Response(ProjectEntitiesSerializer(entities, many=True).data, status=status.HTTP_200_OK)
        return Response({'error': 'Requested project was not found.'}, status=status.HTTP_404_NOT_FOUND)


class ProjectEntitiesListView(APIView):
    model_class = ReferenceEntitiesModel
    serializer_class = UpdateProjectEntitiesSerializer

    def get(self, request, *args, **kwargs):
        project_id = request.GET.get('project')
        if project_id is None:
            return Response({'error': 'could not find `project` param in the get request.'}, status=status.HTTP_400_BAD_REQUEST)
        projects = ProjectModel.objects.filter(id=project_id)
        if len(projects) > 0:
            entities = self.model_class.objects.filter(project__pk=project_id)
            serializer = ProjectEntitiesSerializer(entities, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'Requested project was not found.'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        project_id = request.GET.get('project')
        if project_id is None:
            return Response({'error': 'could not find `project` param in the get request.'}, status=status.HTTP_400_BAD_REQUEST)
        projects = ProjectModel.objects.filter(id=project_id)

        if len(projects) > 0:
            project = projects[0]
            entities = ReferenceEntitiesModel.objects.filter(project=project)
            entities.delete()
            return Response(ProjectEntitiesSerializer(entities, many=True).data, status=status.HTTP_200_OK)
        return Response({'error': 'Requested project was not found.'}, status=status.HTTP_404_NOT_FOUND)


class ProjectEntitiesUpdateView(APIView):
    model_class = ReferenceEntitiesModel
    serializer_class = UpdateProjectEntitiesSerializer

    def post(self, request, *args, **kwargs):
        data = request.data if isinstance(
            request.data, list) else [request.data]
        entities = []
        serializer = self.serializer_class(data=data, many=True)
        serializer.is_valid(raise_exception=True)
        # Save results
        for item in serializer.validated_data:
            try:
                entity = self.model_class.objects.get(
                    id=item['id']).update(name=item['name'])
                entity.save()
                entities.append(entity)
            except self.model_class.DoesNotExist:
                return Response(
                    {'error': 'Requested entity with id {} was not found.'.format(
                        item['id'])},
                    status=status.HTTP_404_NOT_FOUND
                )
        return Response(ProjectEntitiesSerializer(entities, many=True).data, status=status.HTTP_200_OK)

class AnnotationGetSampleView(APIView):
    model_class = ProjectModel

    def get(self, request, pk=None, *args, **kwargs):
        projects = self.model_class.objects.filter(pk=pk)
        if len(projects) > 0:
            project = projects[0]
            current_sample, total_samples = project.get_current_sample(with_len=True)
            processed = project.nb_processed
            rejected = project.nb_rejected
            return Response({
                'current_sample': current_sample,
                'initial_annotations': [],
                'total': total_samples,
                'processed': processed,
                'rejected': rejected
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Requested project was not found.'}, status=status.HTTP_404_NOT_FOUND)

class AnnotationPushSampleView(APIView):
    model_class = ProjectModel
    serializer_class = AnnotationSubmitSerializer

    def post(self, request, pk=None, *args, **kwargs):
        projects = self.model_class.objects.filter(pk=pk)
        if len(projects) > 0:
            project = projects[0]
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            annotated_line = serializer.validated_data
            print(annotated_line)
            project.write_annotation_line(annotated_line)
            return Response({
                'message': "Added successfully"
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Requested project was not found.'}, status=status.HTTP_404_NOT_FOUND)