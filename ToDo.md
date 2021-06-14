## Overall App Structure

1. Frontend
    1. Project Creation
        - Project Name
        - Type of Projects (NER Annotation, Classification)
        - Trainable DL model for semi-automatic annotation
        - Input dataset
    1. Project List/Edit
        - Project Names
        - DL Model
        - Number of annotated examples
        - Edit projects (name, dataset, model)
    1. Project Detail
        - Project info (name, type)
        - Add/edit input datasets
        - Change DL model
        - Add list of reference classess/entities
        - Train DL model (initial training / retraining)
        - Enter Annotation Page
        - Export Annotated Data
    1. Text Annotatoion Components
        - NER Annotation
            - Inputs (Texts, Reference Entities, Initial Annotation)
            - Outputs (Texts, Reference Entities, Modified Annotation, Reject/Accept)
            - Text Display (add/remove tagging, display inconfident predictions,)
            - Reference Entities (list, keyboard input for selection)
            - Accept/Reject (keyboard input)
            - Summary (Nb. annotated, Nb. Rejected, Nb. Remaining, Task type, DL model, Project name)
        - Classification
            - Input (Texts, Reference Classes, Initial Class)
            - Output (Texts, Reference Classes, Modified Class, Reject/Accept)
            - Text Display
            - Reference Classes
            - Accept/Reject
        - Save/Load Annotation State

2. API
    1. Projects
        - Models
        - Views
        - Utils
            - DL model retrieve/save
            - DL model train
            - DL model predict
            - Dataset loader
            - Annotated Data Save Module
        - Views
    1. NER Annotation Handler
        - Views
            - Get next annotation example
            - Save current annotation
            - Summary of annotations
    1. Classification Annotation Handler
        - Views
            - Get next annotation example
            - Save current annotation
            - Summary of annotations

<span style="color:blue">some *blue* text</span>.