from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import (ProjectEntitiesCreateView, CreateProjectView,
                    ListProjectsView, ProjectDetailView, ProjectEntitiesListView,
                    ProjectEntitiesUpdateView, ProjectDataView, AnnotationGetSampleView,
                    AnnotationPushSampleView,
                    ProjectDataUploadView)

urlpatterns = [
    path('projects/', ListProjectsView.as_view()),                              # GET
    path('projects/create/', CreateProjectView.as_view()),                      # POST
    path('projects/<int:pk>/', ProjectDetailView.as_view()),                    # GET, POST, DELETE
    path('projects/<int:pk>/upload/', ProjectDataUploadView.as_view()),         # POST
    path('projects/<int:pk>/data-count/', ProjectDataView.as_view()),           # GET
    path('projects/<int:pk>/get-sample/', AnnotationGetSampleView.as_view()),   # GET
    path('projects/<int:pk>/push-sample/', AnnotationPushSampleView.as_view()), # POST
    path('entities/create/', ProjectEntitiesCreateView.as_view()),              # POST
    path('entities/update/', ProjectEntitiesUpdateView.as_view()),              # POST
    path('entities/', ProjectEntitiesListView.as_view()),                       # GET, DELETE

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
