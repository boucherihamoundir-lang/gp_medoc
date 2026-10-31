import io
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_prescription_pdf(prescription):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    story = []

    # Styles personnalisés
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        textColor=colors.HexColor('#0284c7'),
        leading=22
    )

    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        textColor=colors.HexColor('#334155'),
        leading=15
    )

    meta_style = ParagraphStyle(
        'Meta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        textColor=colors.HexColor('#64748b'),
        leading=13
    )

    rx_style = ParagraphStyle(
        'RxHeader',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=16,
        textColor=colors.HexColor('#0f172a'),
        leading=20
    )

    item_title = ParagraphStyle(
        'ItemTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        textColor=colors.HexColor('#0f172a'),
        leading=14
    )

    item_desc = ParagraphStyle(
        'ItemDesc',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor('#475569'),
        leading=14
    )

    # 1. En-tête Praticien / Cabinet
    story.append(Paragraph(f"<b>{prescription.doctor_name}</b>", title_style))
    story.append(Paragraph(f"Spécialiste en {prescription.doctor_specialty}", subtitle_style))
    story.append(Paragraph(f"{prescription.cabinet_name} • Portail Médical National MEDOC", meta_style))
    story.append(Spacer(1, 15))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0284c7'), spaceAfter=15))

    # 2. Informations Patient & Date
    date_str = prescription.created_at.strftime('%d/%m/%Y')
    patient_info = f"<b>Patient(e) :</b> {prescription.patient_name}"
    if prescription.patient_age:
        patient_info += f" ({prescription.patient_age} ans)"

    meta_table_data = [
        [Paragraph(patient_info, subtitle_style), Paragraph(f"<b>Date :</b> {date_str}", subtitle_style)]
    ]
    meta_table = Table(meta_table_data, colWidths=[360, 150])
    meta_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 20))

    # 3. Symbole de prescription
    story.append(Paragraph("<b>℞ ORDONNANCE MÉDICALE</b>", rx_style))
    story.append(Spacer(1, 15))

    # 4. Liste des médicaments prescrits
    items = prescription.items.all()
    if items:
        for i, item in enumerate(items, 1):
            story.append(Paragraph(f"<b>{i}. {item.medication}</b>", item_title))
            story.append(Paragraph(f"• Posologie : {item.dosage}", item_desc))
            story.append(Paragraph(f"• Durée : {item.duration}", item_desc))
            if item.notes:
                story.append(Paragraph(f"• Recommandations : <i>{item.notes}</i>", item_desc))
            story.append(Spacer(1, 12))
    else:
        story.append(Paragraph("Aucun médicament renseigné.", item_desc))

    story.append(Spacer(1, 30))

    # 5. Signature et Cachet Médical
    signature_data = [
        ["", Paragraph("<b>Signature & Cachet du Praticien :</b>", subtitle_style)],
        ["", Paragraph(f"Dr. {prescription.doctor_name}<br/><i>Document certifié MEDOC Digital</i>", meta_style)]
    ]
    sig_table = Table(signature_data, colWidths=[300, 210])
    sig_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ALIGN', (1,0), (1,-1), 'RIGHT'),
    ]))
    story.append(sig_table)

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
