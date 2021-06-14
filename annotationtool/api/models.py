from django.db import models
from functools import partial
from .utils import tokenize_doc
import json

ANNOTATION_CHOICES = [
    ('ner', 'NER Annotation'),
    ('cls', 'Classification Annotation')
]


def generate_user_file_path(instance, filename, type):
    return "project_{0}/{1}/{2}".format(instance.id, type, filename)

# class InputDataModel(models.Model):
#     pass


class ProjectModel(models.Model):

    name = models.CharField(
        verbose_name="Project Name",
        max_length=100,
        null=False,
        blank=False,
        unique=True
    )
    annot_type = models.CharField(
        verbose_name="Annotation Type",
        max_length=10,
        choices=ANNOTATION_CHOICES,
        null=False,
        blank=False,
        default="ner"
    )
    nlp_model = models.CharField(
        verbose_name="NLP model Used for Annotation",
        max_length=100,
        null=False,
        blank=False
    )
    input_data = models.FileField(
        upload_to=partial(generate_user_file_path, type="input"),
        null=True,
        blank=True
    )
    output_data = models.FileField(
        upload_to=partial(generate_user_file_path, type="output"),
        null=True,
        blank=True,
        editable=False
    )
    nb_processed = models.IntegerField(default=0, null=False)
    nb_rejected = models.IntegerField(default=0, null=False)

    def __str__(self):
        return str(self.name) + " || " + str(self.annot_type)

    def get_input_data_lines(self, count=True):
        if self.input_data:
            with self.input_data.open(mode='r'):
                lines = self.input_data.readlines()
        else:
            lines = []
        if count:
            return len(lines)
        return lines

    def get_output_data_lines(self, count=True):
        if self.output_data:
            with self.output_data.open(mode='r'):
                lines = self.output_data.readlines()
        else:
            lines = []
        if count:
            return len(lines)
        return lines

    def get_current_sample(self, with_len=True):
        idx = self.nb_processed
        samples = self.get_input_data_lines(count=False)
        if idx >= len(samples):
            current_sample = {"sample": dict(text="", tokens=[]), "end": True}
            return (current_sample, len(samples)) if with_len else current_sample

        tokens = tokenize_doc(samples[idx].strip())
        current_sample = {"sample": tokens, "end": False}
        return (current_sample, len(samples)) if with_len else current_sample

    def write_annotation_line(self, data):
        if self.output_data:
            with self.output_data.open(mode='a') as file:
                file.write(json.dumps(data) + "\n")
        # Update pointers
        self.nb_processed += 1
        self.nb_rejected = 0 if data["accepted"] else 1
        self.save(update_fields=["nb_processed", "nb_rejected"])


class ReferenceEntitiesModel(models.Model):
    name=models.CharField(
        verbose_name="Name",
        max_length=100,
        null=False,
        blank=False,
    )
    project=models.ForeignKey(
        ProjectModel, on_delete=models.CASCADE, null=False, blank=False)

    class Meta:
        unique_together=('name', 'project')

# from django.core.files.base import File, ContentFile
# project_1 = ProjectModel(name="Project 1", annot_type="ner", nlp_model="bert_ner")
# project_1.save()

# with open("./example.txt", "r") as f:
#     file = File(f, name="input_example.txt")
#     project_1.input_data.save(file=file, name="input_example.txt")
#     project_1.save()

# project_1.output_data = ContentFile(content=b"", name="output.jsonl")
# project_1.save()
