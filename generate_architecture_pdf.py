"""
Script de génération du document PDF officiel :
Architecture Hybride Microservices Django & Base de Données Firebase - Projet MEDOC
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

PDF_FILENAME = "MEDOC_Architecture_Microservices_Django_Firebase.pdf"

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Header (Pages 2+)
        if self._pageNumber > 1:
            self.drawString(54, 800, "MEDOC — Architecture Hybride Microservices Django & Firebase")
            self.setStrokeColor(colors.HexColor("#e2e8f0"))
            self.setLineWidth(0.5)
            self.line(54, 792, 541, 792)
            
        # Footer (All pages)
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.5)
        self.line(54, 45, 541, 45)
        
        self.drawString(54, 32, "Confidentialité & Propriété de MEDOC Algérie • 2026")
        page_str = f"Page {self._pageNumber} sur {page_count}"
        self.drawRightString(541, 32, page_str)
        self.restoreState()


def create_pdf(filepath):
    doc = SimpleDocTemplate(
        filepath,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#0f172a')
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0284c7')
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=colors.HexColor('#0369a1'),
        spaceBefore=12,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14.5,
        textColor=colors.HexColor('#334155')
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=body_style,
        leftIndent=15,
        spaceAfter=3
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor('#0f172a')
    )

    badge_style = ParagraphStyle(
        'Badge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#059669')
    )

    story = []

    # ==================== EN-TÊTE / COVER ====================
    story.append(Paragraph("MEDOC PORTAL • SANTÉ CONNECTÉE", badge_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("Architecture Hybride :<br/>Microservices Django & Données Firebase", title_style))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Conservation des données Cloud Firestore & Orchestration backend modulaire en 6 microservices", subtitle_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#0284c7'), spaceAfter=14))

    # ==================== 1. INTRODUCTION & VISION ====================
    story.append(Paragraph("1. Vision Globale de l'Architecture", h1_style))
    intro_text = (
        "Cette solution d'ingénierie logicielle répond à une double exigence : <b>conserver l'intégralité "
        "des données temps réel et des utilisateurs existants dans Firebase (Firestore & Auth)</b>, tout en "
        "adoptant une <b>architecture moderne en microservices Django</b>. "
        "Le frontend Web et Mobile (PWA) continue de bénéficier de la réactivité immédiate de Firebase, "
        "tandis que Django prend en charge la logique métier avancée, la sécurité, la validation des règles "
        "médicales et la génération des ordonnances officielles."
    )
    story.append(Paragraph(intro_text, body_style))
    story.append(Spacer(1, 10))

    # ==================== 2. SCHÉMA DU FLUX ====================
    story.append(Paragraph("2. Schéma de Fonctionnement Hybride", h1_style))
    schema_data = [
        [Paragraph("<b>Couche</b>", body_style), Paragraph("<b>Technologie</b>", body_style), Paragraph("<b>Rôle & Responsabilités</b>", body_style)],
        [
            Paragraph("<b>Client Frontend</b>", body_style),
            Paragraph("Vue 3 • Tailwind • PWA", body_style),
            Paragraph("Interface utilisateur pour Médecins et Patients. Écoute temps réel des changements.", body_style)
        ],
        [
            Paragraph("<b>Passerelle API</b>", body_style),
            Paragraph("Nginx Gateway (:8000)", body_style),
            Paragraph("Point d'accès unique, gestion du reverse proxy, routage intelligent et sécurité CORS.", body_style)
        ],
        [
            Paragraph("<b>Microservices</b>", body_style),
            Paragraph("Django 5 • REST Framework", body_style),
            Paragraph("6 services autonomes : Auth, Médecins, Patients, Rendez-vous, Chat, Ordonnances.", body_style)
        ],
        [
            Paragraph("<b>Base Centrale</b>", body_style),
            Paragraph("Cloud Firestore & Auth", body_style),
            Paragraph("Dépôt unique des données (collections users, chats, appointments, prescriptions).", body_style)
        ]
    ]

    t_schema = Table(schema_data, colWidths=[110, 140, 237])
    t_schema.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')])
    ]))
    story.append(t_schema)
    story.append(Spacer(1, 14))

    # ==================== 3. LES 6 MICROSERVICES DJANGO ====================
    story.append(Paragraph("3. Répartition des 6 Microservices Django sur Firebase", h1_style))
    
    microservices_data = [
        [
            Paragraph("<b>Microservice Django</b>", body_style),
            Paragraph("<b>Port</b>", body_style),
            Paragraph("<b>Collection Firebase</b>", body_style),
            Paragraph("<b>Opérations Métier Exécutées</b>", body_style)
        ],
        [
            Paragraph("<b>1. User Service</b>", body_style),
            Paragraph(":8001", body_style),
            Paragraph("<code>/users</code>", body_style),
            Paragraph("Vérification des tokens Firebase Auth, attribution des rôles (Doctor/Patient), validation de la Carte d'Identité Algérienne.", body_style)
        ],
        [
            Paragraph("<b>2. Doctor Service</b>", body_style),
            Paragraph(":8002", body_style),
            Paragraph("<code>/users</code><br/><i>(role: 'doctor')</i>", body_style),
            Paragraph("Annuaire public, filtrage des 58 Wilayas d'Algérie, recherche par spécialité, gestion des tarifs et créneaux.", body_style)
        ],
        [
            Paragraph("<b>3. Patient Service</b>", body_style),
            Paragraph(":8003", body_style),
            Paragraph("<code>/users</code><br/><i>(role: 'patient')</i>", body_style),
            Paragraph("Carnet de santé, groupe sanguin ABO, calcul automatique d'IMC, antécédents, constantes et allergies.", body_style)
        ],
        [
            Paragraph("<b>4. Appointment Service</b>", body_style),
            Paragraph(":8004", body_style),
            Paragraph("<code>/appointments</code>", body_style),
            Paragraph("Prise de rendez-vous en ligne, vérification anti-chevauchement des horaires, gestion de la file d'attente.", body_style)
        ],
        [
            Paragraph("<b>5. Chat Service</b>", body_style),
            Paragraph(":8005", body_style),
            Paragraph("<code>/chats/{id}/messages</code>", body_style),
            Paragraph("Pont WebSockets en direct, notification instantanée, pièces jointes médicales et synchronisation avec Firestore.", body_style)
        ],
        [
            Paragraph("<b>6. Prescription Service</b>", body_style),
            Paragraph(":8006", body_style),
            Paragraph("<code>/prescriptions</code>", body_style),
            Paragraph("Génération côté serveur de <b>fichiers PDF d'ordonnances</b> haute définition avec QR-Code et signature du praticien.", body_style)
        ]
    ]

    t_micro = Table(microservices_data, colWidths=[110, 45, 115, 217])
    t_micro.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0284c7')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#94a3b8')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')])
    ]))
    story.append(t_micro)
    story.append(Spacer(1, 14))

    # ==================== 4. EXEMPLE DE CODE DJANGO <-> FIREBASE ====================
    story.append(Paragraph("4. Exemple d'Intégration : Django interrogeant Firestore", h1_style))
    story.append(Paragraph(
        "Chaque microservice Django utilise le SDK officiel <code>firebase-admin</code> ou l'API REST sécurisée de Firestore. "
        "Voici un exemple concret dans le microservice <b>Doctor Service</b> :",
        body_style
    ))
    story.append(Spacer(1, 6))

    code_snippet = (
        "# services/doctor_service/doctors/views.py\n"
        "from rest_framework.views import APIView\n"
        "from rest_framework.response import Response\n"
        "from firebase_admin import firestore\n"
        "\n"
        "class DoctorDirectoryView(APIView):\n"
        "    \"\"\"Recherche des médecins directement dans la base Firebase /users\"\"\"\n"
        "    def get(self, request):\n"
        "        db = firestore.client()\n"
        "        wilaya = request.query_params.get('wilaya')\n"
        "        query = db.collection('users').where('role', '==', 'doctor')\n"
        "        if wilaya:\n"
        "            query = query.where('wilaya', '==', wilaya)\n"
        "        doctors = [doc.to_dict() | {'id': doc.id} for doc in query.stream()]\n"
        "        return Response(doctors)"
    )

    t_code = Table([[Paragraph(code_snippet.replace('\n', '<br/>').replace(' ', '&nbsp;'), code_style)]], colWidths=[487])
    t_code.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f1f5f9')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(t_code)
    story.append(Spacer(1, 14))

    # ==================== 5. AVANTAGES MAJEURS ====================
    story.append(Paragraph("5. Principaux Avantages de cette Solution", h1_style))
    story.append(Paragraph("<b>1. Conservation totale de l'existant :</b> Vos comptes médecins, patients et historiques de messagerie déjà stockés dans Firebase restent accessibles sans migration risquée.", bullet_style))
    story.append(Paragraph("<b>2. Écosystème hybride performant :</b> Le frontend conserve ses écouteurs <code>onSnapshot()</code> pour la réactivité en direct, tout en bénéficiant de la robustesse de Django pour les tâches lourdes.", bullet_style))
    story.append(Paragraph("<b>3. Scalabilité par Microservice :</b> Si le module de téléconsultation ou de génération d'ordonnances demande plus de charge, il peut être dimensionné indépendamment.", bullet_style))
    story.append(Paragraph("<b>4. Conformité & Sécurité Médicale :</b> Django permet d'appliquer des filtres de sécurité stricts avant toute écriture définitive dans Firestore.", bullet_style))
    story.append(Spacer(1, 10))

    # ==================== 6. CONCLUSION & DÉMARRAGE ====================
    story.append(Paragraph("6. Déploiement et Utilisation au Quotidien", h1_style))
    story.append(Paragraph(
        "L'ensemble des conteneurs est orchestré via <b>Docker Compose</b>. Une seule commande permet d'activer la stack :<br/>"
        "<code>cd backend && docker compose up -d</code><br/>"
        "L'API Gateway Nginx prend en charge la réception des requêtes sur le port <b>8000</b> et les distribue en toute transparence.",
        body_style
    ))

    # Build the document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF généré avec succès : {filepath}")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    out_path = os.path.join(current_dir, PDF_FILENAME)
    create_pdf(out_path)
