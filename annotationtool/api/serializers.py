from rest_framework import fields, serializers
from .models import ProjectModel, ReferenceEntitiesModel


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectModel
        fields = '__all__'


class CreateProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectModel
        fields = ['id', 'name', 'annot_type', 'nlp_model' ]


class ProjectDataUploadSerializer(serializers.Serializer):
    file = serializers.FileField()


class CreateProjectEntitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferenceEntitiesModel
        fields = ('name', 'project')
        # extra_kwargs = {'id': {'read_only': False}}


class UpdateProjectEntitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferenceEntitiesModel
        fields = ('id', 'name')
        extra_kwargs = {'id': {'read_only': False}}


class ProjectEntitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferenceEntitiesModel
        fields = ('id', 'name', 'project')#'__all__'
        
        # extra_kwargs = {'id': {'read_only': False}}

## Defining Serializer for Handling Annotations
class AnnotationsSerializer(serializers.Serializer):
    start = serializers.IntegerField()
    end = serializers.IntegerField()
    ent = serializers.CharField()
    source = serializers.CharField()
    tokenIdStart = serializers.IntegerField()
    tokenIdEnd = serializers.IntegerField()

class AnnotationTokensSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    start = serializers.IntegerField()
    end = serializers.IntegerField()
    text = serializers.CharField()

class AnnotationSampleSerializer(serializers.Serializer):
    text = serializers.CharField()
    tokens = AnnotationTokensSerializer(many=True)

class AnnotationSubmitSerializer(serializers.Serializer): 
    """Final Serializer to be used for submit requests"""
    sample = AnnotationSampleSerializer
    annotations = AnnotationsSerializer(many=True)
    accepted = serializers.BooleanField(required=True)