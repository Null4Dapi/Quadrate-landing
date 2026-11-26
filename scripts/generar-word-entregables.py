import os
import re
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    """Establece el color de fondo de una celda."""
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Establece los márgenes internos (padding) de una celda en dxa."""
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_table_borders(table, color="CBD5E1"):
    """Aplica bordes finos a una tabla."""
    tblPr = table._element.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="4" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="single" w:sz="4" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:insideH w:val="single" w:sz="4" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def add_styled_paragraph(doc, text, style_name="Normal", space_after=6, space_before=0, line_spacing=1.15):
    p = doc.add_paragraph(style=style_name)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.line_spacing = line_spacing
    render_formatted_text(p, text)
    return p

def render_formatted_text(paragraph, text, default_color=None):
    """Parsea markdown inline (**negrita**, *cursiva*, `código`, enlaces) y lo añade al párrafo."""
    # Reemplazar <br> con salto de línea
    text = re.sub(r'<br\s*/?>', '\n', text)
    
    # Patrón de tokens: negrita-cursiva, negrita, cursiva, código
    pattern = re.compile(r'(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))')
    tokens = pattern.split(text)
    
    for token in tokens:
        if not token:
            continue
        if token.startswith('***') and token.endswith('***'):
            run = paragraph.add_run(token[3:-3])
            run.bold = True
            run.italic = True
        elif token.startswith('**') and token.endswith('**'):
            run = paragraph.add_run(token[2:-2])
            run.bold = True
        elif token.startswith('*') and token.endswith('*'):
            run = paragraph.add_run(token[1:-1])
            run.italic = True
        elif token.startswith('`') and token.endswith('`'):
            run = paragraph.add_run(token[1:-1])
            run.font.name = "Consolas"
            run.font.size = Pt(9.5)
            run.font.color.rgb = RGBColor(14, 116, 144) # Cyan/Navy oscuro
        elif token.startswith('[') and '](' in token and token.endswith(')'):
            match = re.match(r'\[(.*?)\]\((.*?)\)', token)
            if match:
                link_text, url = match.groups()
                run = paragraph.add_run(link_text)
                run.font.color.rgb = RGBColor(2, 132, 199) # Azul marca
                run.underline = True
            else:
                paragraph.add_run(token)
        else:
            run = paragraph.add_run(token)
            if default_color:
                run.font.color.rgb = default_color

def convert_md_to_docx(md_path, docx_path, doc_title="Entregable Académico"):
    print(f"Convirtiendo {md_path} -> {docx_path}")
    with open(md_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    doc = Document()

    # Configurar márgenes de página (2.5 cm en todos los lados)
    for section in doc.sections:
        section.top_margin = Inches(0.98) # ~2.5 cm
        section.bottom_margin = Inches(0.98)
        section.left_margin = Inches(0.98)
        section.right_margin = Inches(0.98)

    # Configurar estilo Normal
    normal_style = doc.styles["Normal"]
    normal_style.font.name = "Calibri"
    normal_style.font.size = Pt(10.5)
    normal_style.font.color.rgb = RGBColor(15, 23, 42) # Slate 900

    i = 0
    in_code_block = False
    code_lines = []
    in_table = False
    table_lines = []

    while i < len(lines):
        line = lines[i].rstrip("\r\n")

        # Manejo de bloques de código
        if line.strip().startswith("```"):
            if in_code_block:
                # Cerrar bloque de código
                in_code_block = False
                code_text = "\n".join(code_lines)
                
                # Crear tabla de 1x1 para el bloque de código con fondo sombreado
                code_table = doc.add_table(rows=1, cols=1)
                code_table.alignment = WD_TABLE_ALIGNMENT.CENTER
                code_table.autofit = False
                code_table.columns[0].width = Inches(6.5)
                
                cell = code_table.cell(0, 0)
                set_cell_background(cell, "F8FAFC")
                set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
                
                # Borde fino a la izquierda
                tcPr = cell._element.get_or_add_tcPr()
                borders = parse_xml(
                    f'<w:tcBorders {nsdecls("w")}>'
                    f'<w:left w:val="single" w:sz="18" w:space="0" w:color="0284C7"/>'
                    f'<w:top w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>'
                    f'<w:bottom w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>'
                    f'<w:right w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>'
                    f'</w:tcBorders>'
                )
                tcPr.append(borders)
                
                p = cell.paragraphs[0]
                p.paragraph_format.space_before = Pt(2)
                p.paragraph_format.space_after = Pt(2)
                p.paragraph_format.line_spacing = 1.05
                run = p.add_run(code_text)
                run.font.name = "Consolas"
                run.font.size = Pt(8.5)
                run.font.color.rgb = RGBColor(30, 41, 59)
                
                # Espaciado posterior
                spacer = doc.add_paragraph()
                spacer.paragraph_format.space_before = Pt(0)
                spacer.paragraph_format.space_after = Pt(4)
                code_lines = []
            else:
                in_code_block = True
                code_lines = []
            i += 1
            continue

        if in_code_block:
            code_lines.append(line)
            i += 1
            continue

        # Manejo de tablas Markdown
        if line.strip().startswith("|") and line.strip().endswith("|"):
            table_lines.append(line.strip())
            i += 1
            continue
        elif table_lines:
            # Procesar tabla acumulada
            process_markdown_table(doc, table_lines)
            table_lines = []
            # Continuar procesando la línea actual

        # Líneas vacías
        if not line.strip():
            i += 1
            continue

        # Regla horizontal (---)
        if line.strip() == "---":
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(6)
            p.paragraph_format.space_after = Pt(6)
            pBdr = parse_xml(
                f'<w:pBdr {nsdecls("w")}>'
                f'<w:bottom w:val="single" w:sz="6" w:space="1" w:color="E2E8F0"/>'
                f'</w:pBdr>'
            )
            p._element.get_or_add_pPr().append(pBdr)
            i += 1
            continue

        # Encabezados
        if line.startswith("# "):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(14)
            p.paragraph_format.space_after = Pt(4)
            run = p.add_run(line[2:].strip())
            run.font.name = "Calibri"
            run.font.size = Pt(18)
            run.bold = True
            run.font.color.rgb = RGBColor(2, 132, 199) # Brand Blue
            i += 1
            continue

        if line.startswith("## "):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(12)
            p.paragraph_format.space_after = Pt(3)
            run = p.add_run(line[3:].strip())
            run.font.name = "Calibri"
            run.font.size = Pt(13.5)
            run.bold = True
            run.font.color.rgb = RGBColor(15, 23, 42) # Slate 900
            i += 1
            continue

        if line.startswith("### "):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(9)
            p.paragraph_format.space_after = Pt(2)
            run = p.add_run(line[4:].strip())
            run.font.name = "Calibri"
            run.font.size = Pt(11.5)
            run.bold = True
            run.font.color.rgb = RGBColor(51, 65, 85) # Slate 700
            i += 1
            continue

        if line.startswith("#### "):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(6)
            p.paragraph_format.space_after = Pt(2)
            run = p.add_run(line[5:].strip())
            run.font.name = "Calibri"
            run.font.size = Pt(10.5)
            run.bold = True
            run.italic = True
            run.font.color.rgb = RGBColor(71, 85, 105)
            i += 1
            continue

        # Citas (Blockquotes: > ...)
        if line.startswith("> "):
            quote_text = line[2:].strip()
            q_table = doc.add_table(rows=1, cols=1)
            q_table.alignment = WD_TABLE_ALIGNMENT.CENTER
            q_table.autofit = False
            q_table.columns[0].width = Inches(6.5)
            cell = q_table.cell(0, 0)
            set_cell_background(cell, "F1F5F9")
            set_cell_margins(cell, top=80, bottom=80, left=140, right=140)
            tcPr = cell._element.get_or_add_tcPr()
            borders = parse_xml(
                f'<w:tcBorders {nsdecls("w")}>'
                f'<w:left w:val="single" w:sz="16" w:space="0" w:color="0284C7"/>'
                f'<w:top w:val="none"/>'
                f'<w:bottom w:val="none"/>'
                f'<w:right w:val="none"/>'
                f'</w:tcBorders>'
            )
            tcPr.append(borders)
            qp = cell.paragraphs[0]
            qp.paragraph_format.space_before = Pt(2)
            qp.paragraph_format.space_after = Pt(2)
            render_formatted_text(qp, quote_text, default_color=RGBColor(30, 41, 59))
            i += 1
            continue

        # Listas con viñetas (- o *)
        if re.match(r'^[\*\-]\s+(.*)', line):
            match = re.match(r'^[\*\-]\s+(.*)', line)
            bullet_text = match.group(1)
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15
            render_formatted_text(p, bullet_text)
            i += 1
            continue

        # Listas numeradas (1. ...)
        if re.match(r'^\d+\.\s+(.*)', line):
            match = re.match(r'^\d+\.\s+(.*)', line)
            num_text = match.group(1)
            p = doc.add_paragraph(style='List Number')
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15
            render_formatted_text(p, num_text)
            i += 1
            continue

        # Párrafo normal
        add_styled_paragraph(doc, line, space_after=5, line_spacing=1.15)
        i += 1

    # Si quedó alguna tabla al final
    if table_lines:
        process_markdown_table(doc, table_lines)

    doc.save(docx_path)
    print(f"Guardado exitoso: {docx_path}")

def process_markdown_table(doc, lines):
    """Convierte una lista de líneas de tabla Markdown a una tabla docx profesional."""
    # Filtrar línea separadora (| --- | --- |)
    content_rows = []
    for line in lines:
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        # Ignorar si es la fila separadora de guiones
        if all(re.match(r'^:?-+:?$', c) for c in cells if c):
            continue
        content_rows.append(cells)

    if not content_rows:
        return

    num_rows = len(content_rows)
    num_cols = max(len(r) for r in content_rows)

    table = doc.add_table(rows=num_rows, cols=num_cols)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    set_table_borders(table, color="CBD5E1")

    # Ancho total disponible aprox 6.5 pulgadas
    col_width = Inches(6.5 / num_cols)

    for row_idx, row_data in enumerate(content_rows):
        is_header = (row_idx == 0)
        row = table.rows[row_idx]
        
        # Permitir salto de fila si es larga
        trPr = row._element.get_or_add_trPr()
        trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))

        # Si es cabecera, repetir en páginas siguientes
        if is_header:
            trPr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))

        for col_idx in range(num_cols):
            cell = row.cells[col_idx]
            cell.width = col_width
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

            cell_text = row_data[col_idx] if col_idx < len(row_data) else ""

            if is_header:
                set_cell_background(cell, "0F172A") # Navy Slate oscuro
                set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
                p = cell.paragraphs[0]
                p.paragraph_format.space_before = Pt(2)
                p.paragraph_format.space_after = Pt(2)
                # Parsear texto en blanco y negrita
                render_formatted_text(p, cell_text, default_color=RGBColor(255, 255, 255))
                for run in p.runs:
                    run.bold = True
                    run.font.size = Pt(9.5)
            else:
                bg = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
                set_cell_background(cell, bg)
                set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
                p = cell.paragraphs[0]
                p.paragraph_format.space_before = Pt(2)
                p.paragraph_format.space_after = Pt(2)
                render_formatted_text(p, cell_text)
                for run in p.runs:
                    run.font.size = Pt(9)

    # Espacio tras la tabla
    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_before = Pt(0)
    spacer.paragraph_format.space_after = Pt(6)

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    entregables_dir = os.path.join(base_dir, "docs", "university", "entregables")
    
    etapa1_md = os.path.join(entregables_dir, "entrega-012-etapa1.md")
    etapa1_docx = os.path.join(entregables_dir, "entrega-012-etapa1.docx")
    convert_md_to_docx(etapa1_md, etapa1_docx, "Guía 12 - Etapa 1: Next.js 15 App Router")
    
    etapa2_md = os.path.join(entregables_dir, "entrega-012-etapa2.md")
    etapa2_docx = os.path.join(entregables_dir, "entrega-012-etapa2.docx")
    convert_md_to_docx(etapa2_md, etapa2_docx, "Guía 12 - Etapa 2: Core Web Vitals & DevTools")
