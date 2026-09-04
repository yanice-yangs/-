from pathlib import Path
from pypdf import PdfReader
import pypdfium2 as pdfium

source = r'D:\大学各项事务\简历制作与作品集\截止2026年7月26日作品集和简历\杨雪梅—视觉设计师—作品集—17706882979.pdf'
out = Path('public/assets/portfolio')
out.mkdir(parents=True, exist_ok=True)
reader = PdfReader(source)
(out / 'profile.jpg').write_bytes(reader.pages[1].images[0].data)
doc = pdfium.PdfDocument(source)
for number in [14, 22, 42, 49, 50, 51, 57, 61, 63, 64, 65, 66, 72]:
    page = doc[number-1]
    image = page.render(scale=1600/page.get_width()).to_pil().convert('RGB')
    image.save(out / f'project-{number:02}.webp', 'WEBP', quality=88)
    page.close()
