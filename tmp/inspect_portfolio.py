from pathlib import Path
import pypdfium2 as pdfium
from PIL import Image, ImageDraw

source = r'D:\大学各项事务\简历制作与作品集\截止2026年7月26日作品集和简历\杨雪梅—视觉设计师—作品集—17706882979.pdf'
doc = pdfium.PdfDocument(source)
out = Path('tmp/pdfs')
out.mkdir(parents=True, exist_ok=True)
for start in range(0, len(doc), 20):
    sheet = Image.new('RGB', (1600, 5 * 265), '#ddd')
    draw = ImageDraw.Draw(sheet)
    for n in range(start, min(start + 20, len(doc))):
        page = doc[n]
        im = page.render(scale=3).to_pil().convert('RGB')
        im.save(out / f'page-{n+1:02}.jpg', quality=90)
        im.thumbnail((390, 235))
        x, y = ((n-start)%4)*400, ((n-start)//4)*265
        sheet.paste(im, (x, y+25))
        draw.text((x+5,y+5), str(n+1), fill='black')
        page.close()
    sheet.save(out / f'sheet-{start//20+1}.jpg')
