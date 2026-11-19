"""Kavram şekilleri için ortak SVG yardımcıları (Modül 0 ve 1 üreteçleri kullanır).
© 2026 Prof. Dr. Mehmet Songur — PolyForm Strict 1.0.0 (LICENSE-CODE.md)"""
import json, math, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def num(x, d, lang):
    s = f"{x:,.{d}f}"
    if lang == "tr":
        s = s.replace(",", "X").replace(".", ",").replace("X", ".")
    return s


def L(tr, en):
    return {"tr": tr, "en": en}


class Fig:
    def __init__(self, w, h):
        self.w, self.h, self.parts = w, h, []

    def add(self, s):
        self.parts.append(s)

    def svg(self, label):
        return (f'<svg class="cfig" viewBox="0 0 {self.w} {self.h}" role="img" aria-label="{esc(label)}" '
                f'xmlns="http://www.w3.org/2000/svg">' + "".join(self.parts) + "</svg>")

    def text(self, x, y, s, cls="tk", anchor="middle", extra=""):
        self.add(f'<text x="{x:.1f}" y="{y:.1f}" class="{cls}" text-anchor="{anchor}" {extra}>{esc(s)}</text>')

    def mtext(self, x, y, s, cls="tk", anchor="middle", lh=15):
        """Çok satırlı metin; y ortadaki satırın tabanı olacak biçimde dikey ortalanır."""
        parts = s.split("\n")
        y0 = y - (len(parts) - 1) * lh / 2
        for i, p in enumerate(parts):
            self.text(x, y0 + i * lh, p, cls, anchor)

    def line(self, x1, y1, x2, y2, cls="ax"):
        self.add(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" class="{cls}"/>')

    def rect(self, x, y, w, h, cls="box", rx=0):
        self.add(f'<rect x="{x:.1f}" y="{y:.1f}" width="{max(w, 0):.1f}" height="{max(h, 0):.1f}" rx="{rx}" class="{cls}"/>')

    def circle(self, x, y, r, cls="d1"):
        self.add(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" class="{cls}"/>')

    def ellipse(self, x, y, rx, ry, cls="ring"):
        self.add(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{rx}" ry="{ry}" class="{cls}"/>')

    def path(self, pts, cls="l1"):
        if not pts:
            return
        d = "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts)
        self.add(f'<path d="{d}" class="{cls}"/>')

    def arrow(self, x1, y1, x2, y2, cls="arr", head=7):
        self.line(x1, y1, x2, y2, cls)
        a = math.atan2(y2 - y1, x2 - x1)
        p1 = (x2 - head * math.cos(a - 0.45), y2 - head * math.sin(a - 0.45))
        p2 = (x2 - head * math.cos(a + 0.45), y2 - head * math.sin(a + 0.45))
        hc = "ah" + (" bad" if "bad" in cls else (" good" if "good" in cls else ""))
        self.add(f'<polygon points="{x2:.1f},{y2:.1f} {p1[0]:.1f},{p1[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}" class="{hc}"/>')

    def card(self, x, y, w, h, title, body="", cls="box c1s", tcls="lb", bcls="tk", rx=10, lh=15):
        self.rect(x, y, w, h, cls, rx)
        if body:
            nb = len(body.split("\n"))
            th = len(title.split("\n"))
            tot = th * lh + 6 + nb * lh
            ty = y + h / 2 - tot / 2 + lh - 3
            self.mtext(x + w / 2, ty + (th - 1) * lh / 2, title, tcls, "middle", lh)
            self.mtext(x + w / 2, ty + th * lh + 6 + (nb - 1) * lh / 2, body, bcls, "middle", lh)
        else:
            self.mtext(x + w / 2, y + h / 2 + 4, title, tcls, "middle", lh)


class Panel:
    def __init__(self, fig, x, y, w, h, xr, yr):
        self.f, self.x, self.y, self.w, self.h, self.xr, self.yr = fig, x, y, w, h, xr, yr

    def sx(self, v):
        return self.x + (v - self.xr[0]) / (self.xr[1] - self.xr[0]) * self.w

    def sy(self, v):
        v = min(max(v, self.yr[0]), self.yr[1])
        return self.y + self.h - (v - self.yr[0]) / (self.yr[1] - self.yr[0]) * self.h

    def frame(self, xt=None, yt=None, xl=None, yl=None, xfmt=str, yfmt=str, grid=True):
        f = self.f
        if yt:
            for v in yt:
                if grid:
                    f.line(self.x, self.sy(v), self.x + self.w, self.sy(v), "gr")
                f.text(self.x - 6, self.sy(v) + 4, yfmt(v), "tk", "end")
        if xt:
            for v in xt:
                f.text(self.sx(v), self.y + self.h + 15, xfmt(v), "tk")
        f.line(self.x, self.y + self.h, self.x + self.w, self.y + self.h, "ax")
        f.line(self.x, self.y, self.x, self.y + self.h, "ax")
        if xl:
            f.text(self.x + self.w / 2, self.y + self.h + 32, xl, "lb")
        if yl:
            cx, cy = self.x - 40, self.y + self.h / 2
            f.text(cx, cy, yl, "lb", "middle", f'transform="rotate(-90 {cx:.1f} {cy:.1f})"')

    def curve(self, xs, ys, cls):
        self.f.path([(self.sx(a), self.sy(b)) for a, b in zip(xs, ys)], cls)

    def dots(self, xs, ys, cls="d1", r=3):
        for a, b in zip(xs, ys):
            self.f.circle(self.sx(a), self.sy(b), r, cls)


def legend(fig, x, y, items, step=18):
    for i, (cls, lab) in enumerate(items):
        yy = y + i * step
        if cls.startswith("d"):
            fig.circle(x + 9, yy - 4, 4, cls)
        elif cls.startswith("bar"):
            fig.rect(x + 3, yy - 10, 12, 12, cls, 2)
        else:
            fig.line(x, yy - 4, x + 18, yy - 4, cls)
        fig.text(x + 25, yy, lab, "lg", "start")


def flow(f, steps, x0, y, w, h, gap, classes=None, lh=15):
    """Yatay akış kutuları + oklar."""
    classes = classes or ["c0s", "c1s", "c2s", "c3s", "c4s", "c0s", "c1s"]
    for i, s in enumerate(steps):
        x = x0 + i * (w + gap)
        f.rect(x, y, w, h, "box " + classes[i % len(classes)], 10)
        f.text(x + 12, y - 7, str(i + 1), "num", "start")
        f.mtext(x + w / 2, y + h / 2 + 4, s, "tk", "middle", lh)
        if i < len(steps) - 1:
            f.arrow(x + w + 3, y + h / 2, x + w + gap - 3, y + h / 2)


def write(path, var, figs, nums=None, header=""):
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(f"/* {header} — tools/ altındaki üretici tarafından oluşturuldu, elle düzenlemeyin.\n * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt) */\n")
        fh.write(f"window.{var}_FIGS = " + json.dumps(figs, ensure_ascii=False) + ";\n")
        if nums is not None:
            fh.write(f"window.{var}_NUMS = " + json.dumps(nums, ensure_ascii=False) + ";\n")
    print("yazıldı:", path, round(os.path.getsize(path) / 1024), "KB")
