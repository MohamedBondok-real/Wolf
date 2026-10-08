#!/usr/bin/env python3
"""
Generates cinematic placeholder imagery and audio for the website.

These are NOT the final photos — they are atmospheric placeholders so the
site is fully functional out of the box. Replace the files inside
    public/images/her/     (her photos)
    public/images/wolves/  (wolf world)
    public/audio/          (music + sound effects)
with real assets and everything updates automatically.
"""
import math
import os
import random
import struct
import wave

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HER = os.path.join(ROOT, "public", "images", "her")
WOLVES = os.path.join(ROOT, "public", "images", "wolves")
AUDIO = os.path.join(ROOT, "public", "audio")

for d in (HER, WOLVES, AUDIO):
    os.makedirs(d, exist_ok=True)

random.seed(42)
np.random.seed(42)

# ---------------------------------------------------------------- helpers
PALETTES = {
    "dusk": [(10, 5, 20), (74, 26, 58), (29, 42, 77), (216, 199, 245)],
    "wine": [(8, 4, 12), (110, 31, 60), (142, 42, 77), (243, 198, 211)],
    "night": [(4, 6, 16), (20, 29, 56), (43, 58, 103), (184, 160, 230)],
    "forest": [(3, 8, 8), (10, 26, 22), (24, 48, 52), (150, 180, 220)],
    "moon": [(6, 6, 14), (24, 24, 48), (70, 70, 120), (235, 235, 250)],
    "ember": [(12, 5, 4), (80, 28, 24), (120, 50, 40), (250, 200, 170)],
}


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient_bg(w, h, stops):
    """Vertical multi-stop gradient."""
    img = Image.new("RGB", (w, h))
    px = img.load()
    n = len(stops) - 1
    for y in range(h):
        t = y / max(h - 1, 1)
        seg = min(int(t * n), n - 1)
        local = t * n - seg
        c = lerp(stops[seg], stops[seg + 1], local)
        for x in range(0, w, 4):
            for xx in range(x, min(x + 4, w)):
                px[xx, y] = c
    return img


def add_stars(img, count, max_r=2.2, glow=True):
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for _ in range(count):
        x, y = random.uniform(0, w), random.uniform(0, h * 0.75)
        r = random.uniform(0.4, max_r)
        alpha = random.randint(90, 255)
        col = random.choice([(255, 255, 255), (216, 199, 245), (243, 198, 211), (184, 200, 255)])
        if glow and r > 1.2:
            d.ellipse([x - r * 4, y - r * 4, x + r * 4, y + r * 4], fill=col + (alpha // 5,))
        d.ellipse([x - r, y - r, x + r, y + r], fill=col + (alpha,))
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def add_bokeh(img, count):
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for _ in range(count):
        x, y = random.uniform(0, w), random.uniform(0, h)
        r = random.uniform(20, 110)
        alpha = random.randint(14, 46)
        col = random.choice([(216, 199, 245), (243, 198, 211), (142, 160, 220), (200, 120, 160)])
        d.ellipse([x - r, y - r, x + r, y + r], fill=col + (alpha,))
    overlay = overlay.filter(ImageFilter.GaussianBlur(18))
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def add_light_rays(img):
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    cx, cy = w * random.uniform(0.2, 0.8), h * random.uniform(0.0, 0.2)
    for i in range(7):
        ang = math.radians(random.uniform(-38, 38))
        length = h * random.uniform(1.1, 1.7)
        spread = random.uniform(60, 160)
        x2 = cx + math.sin(ang) * length
        y2 = cy + math.cos(ang) * length
        col = random.choice([(216, 199, 245), (243, 198, 211), (255, 255, 255)])
        d.polygon([(cx, cy), (x2 - spread, y2), (x2 + spread, y2)], fill=col + (26,))
    overlay = overlay.filter(ImageFilter.GaussianBlur(22))
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def add_figure(img, kind="portrait"):
    """Soft abstract silhouette suggesting a person — tasteful, never explicit."""
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    cx = w * random.uniform(0.38, 0.62)
    base = h * random.uniform(0.96, 1.05)
    scale = h / 900.0
    tone = random.choice([(20, 10, 28), (16, 12, 30), (30, 12, 24)])
    # shoulders / body
    bw = w * random.uniform(0.34, 0.5)
    d.ellipse([cx - bw * 0.32, base - h * 0.62 * scale * 1.6, cx + bw * 0.32, base - h * 0.62 * scale * 0.35], fill=tone + (235,))
    # head
    hr = h * 0.085 * scale
    hy = base - h * 0.62 * scale * 1.35
    d.ellipse([cx - hr, hy - hr * 1.15, cx + hr, hy + hr * 0.85], fill=tone + (240,))
    # hair glow rim
    d.ellipse([cx - hr * 1.12, hy - hr * 1.35, cx + hr * 1.12, hy + hr * 0.6],
              outline=(216, 199, 245, 70), width=max(2, int(3 * scale)))
    overlay = overlay.filter(ImageFilter.GaussianBlur(1.2))
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def add_vignette(img, strength=0.62):
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    steps = 60
    for i in range(steps):
        t = i / steps
        alpha = int(255 * strength * (t ** 2.2))
        inset = int(max(w, h) * 0.55 * t)
        if inset >= w / 2 or inset >= h / 2:
            break
        d.rectangle([inset, inset, w - inset, h - inset], outline=(2, 0, 6, alpha))
    overlay = overlay.filter(ImageFilter.GaussianBlur(30))
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def add_grain(img, amount=9):
    w, h = img.size
    arr = np.asarray(img.convert("L"), dtype=np.int16)
    noise = np.random.randint(-amount, amount + 1, size=arr.shape)
    arr = np.clip(arr + noise, 0, 255).astype(np.uint8)
    grain = Image.fromarray(arr).convert("RGBA")
    rgb = np.asarray(img.convert("RGB")).astype(np.int16)
    # apply luminance noise to all channels lightly
    out = np.clip(rgb + (noise / 3)[..., None], 0, 255).astype(np.uint8)
    base = Image.fromarray(out).convert("RGBA")
    return Image.alpha_composite(base, grain.point(lambda p: p // 3))


def cinematic_photo(path, w, h, palette, kind="portrait", label=None):
    stops = PALETTES[palette]
    img = gradient_bg(w, h, stops)
    img = add_light_rays(img)
    img = add_bokeh(img, random.randint(8, 18))
    if kind == "portrait":
        img = add_figure(img)
    elif kind == "scene":
        img = add_mountains(img)
    img = add_stars(img, count=int(w * h / 9000), max_r=1.8)
    img = add_vignette(img)
    img = add_grain(img, 8)
    img.convert("RGB").save(path, "JPEG", quality=86)
    print("wrote", os.path.relpath(path, ROOT))


def add_mountains(img):
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for layer, (col, base_frac, amp) in enumerate([
        ((12, 8, 20, 220), 0.78, 0.10),
        ((18, 12, 30, 200), 0.88, 0.08),
        ((26, 16, 40, 180), 0.97, 0.06),
    ]):
        pts = [(0, h)]
        x = 0
        while x <= w:
            y = h * (base_frac - amp * (0.5 + 0.5 * math.sin(x / w * random.uniform(2, 5) + layer * 3)))
            y -= random.uniform(0, h * 0.03)
            pts.append((x, y))
            x += max(8, w // 24)
        pts.append((w, h))
        d.polygon(pts, fill=col)
    overlay = overlay.filter(ImageFilter.GaussianBlur(0.6))
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def draw_moon(img, cx, cy, r, glow=True):
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    if glow:
        for i in range(14, 0, -1):
            d.ellipse([cx - r - i * 9, cy - r - i * 9, cx + r + i * 9, cy + r + i * 9],
                      fill=(200, 200, 235, 7))
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(238, 236, 248, 255))
    for _ in range(int(r / 6)):
        cr = random.uniform(1, r * 0.16)
        mx = cx + random.uniform(-r * 0.7, r * 0.7)
        my = cy + random.uniform(-r * 0.7, r * 0.7)
        d.ellipse([mx - cr, my - cr, mx + cr, my + cr], fill=(214, 210, 228, 160))
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def draw_pine(overlay_draw, x, base_y, hgt, col):
    wtri = hgt * 0.42
    for tier in range(4):
        y1 = base_y - hgt * (0.25 + 0.22 * tier)
        y2 = base_y - hgt * (0.05 + 0.22 * tier)
        half = wtri * (1 - tier * 0.16)
        overlay_draw.polygon([(x - half, y1), (x + half, y1), (x, y2)], fill=col)
    overlay_draw.rectangle([x - hgt * 0.02, base_y - hgt * 0.05, x + hgt * 0.02, base_y], fill=col)


def wolf_scene(path, w, h, palette="forest", moon=True, wolves=1, fog=True):
    stops = PALETTES[palette]
    img = gradient_bg(w, h, stops)
    img = add_stars(img, count=int(w * h / 7000), max_r=2.0)
    if moon:
        img = draw_moon(img, w * random.uniform(0.62, 0.82), h * 0.24, min(w, h) * 0.14)
    img = add_mountains(img)
    # pine forest silhouette
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    n_trees = int(w / 55)
    for i in range(n_trees):
        tx = (i + random.uniform(0.2, 0.8)) * w / n_trees
        th = h * random.uniform(0.16, 0.4)
        shade = random.randint(3, 14)
        draw_pine(d, tx, h * random.uniform(0.97, 1.04), th, (shade, shade + 6, shade + 10, 255))
    img = Image.alpha_composite(img, overlay)
    if wolves:
        img = draw_wolf_silhouettes(img, wolves)
    if fog:
        img = add_fog(img)
    img = add_vignette(img, 0.55)
    img = add_grain(img, 7)
    img.convert("RGB").save(path, "JPEG", quality=86)
    print("wrote", os.path.relpath(path, ROOT))


def draw_wolf_silhouettes(img, count):
    """Stylized howling wolf silhouettes on a ridge."""
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)

    def wolf(cx, base_y, s, flip=False):
        col = (4, 3, 8, 245)
        m = -1 if flip else 1
        # body
        d.polygon([
            (cx - 46 * s * m, base_y - 26 * s), (cx - 10 * s * m, base_y - 34 * s),
            (cx + 26 * s * m, base_y - 32 * s), (cx + 44 * s * m, base_y - 20 * s),
            (cx + 40 * s * m, base_y - 6 * s), (cx - 40 * s * m, base_y - 6 * s),
        ], fill=col)
        # head + snout, tilted up (howling)
        d.polygon([
            (cx + 26 * s * m, base_y - 32 * s), (cx + 44 * s * m, base_y - 52 * s),
            (cx + 58 * s * m, base_y - 62 * s), (cx + 66 * s * m, base_y - 58 * s),
            (cx + 52 * s * m, base_y - 42 * s), (cx + 40 * s * m, base_y - 28 * s),
        ], fill=col)
        # ears
        d.polygon([(cx + 40 * s * m, base_y - 50 * s), (cx + 46 * s * m, base_y - 62 * s),
                   (cx + 50 * s * m, base_y - 48 * s)], fill=col)
        # legs
        for lx in (-34, -18, 16, 32):
            x0 = cx + lx * s * m
            x1 = cx + (lx + 8) * s * m
            d.rectangle([min(x0, x1), base_y - 8 * s, max(x0, x1), base_y], fill=col)
        # tail
        d.polygon([(cx - 44 * s * m, base_y - 24 * s), (cx - 66 * s * m, base_y - 40 * s),
                   (cx - 62 * s * m, base_y - 18 * s)], fill=col)

    ridge_y = h * 0.93
    for i in range(count):
        wx = w * (0.2 + 0.6 * i / max(count, 1)) + random.uniform(-30, 30)
        wolf(wx, ridge_y, random.uniform(0.7, 1.3), flip=bool(i % 2))
    overlay = overlay.filter(ImageFilter.GaussianBlur(0.4))
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def add_fog(img):
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for _ in range(6):
        y = random.uniform(h * 0.45, h * 0.95)
        ry = random.uniform(h * 0.05, h * 0.12)
        col = random.choice([(160, 170, 210), (190, 180, 220), (120, 140, 190)])
        d.ellipse([-w * 0.2, y - ry, w * 0.6, y + ry], fill=col + (22,))
        d.ellipse([w * 0.4, y - ry * 0.8, w * 1.2, y + ry * 0.8], fill=col + (18,))
    overlay = overlay.filter(ImageFilter.GaussianBlur(26))
    return Image.alpha_composite(img.convert("RGBA"), overlay)


# ---------------------------------------------------------------- her photos
HER_SPECS = [
    ("hero.jpg", 1600, 1000, "dusk", "portrait"),
    ("profile.jpg", 900, 1100, "wine", "portrait"),
    ("final.jpg", 1400, 1000, "night", "portrait"),
    ("photo1.jpg", 900, 1200, "dusk", "portrait"),
    ("photo2.jpg", 1200, 900, "wine", "scene"),
    ("photo3.jpg", 900, 900, "night", "portrait"),
    ("photo4.jpg", 1200, 800, "dusk", "scene"),
    ("photo5.jpg", 900, 1150, "wine", "portrait"),
    ("photo6.jpg", 1100, 900, "night", "portrait"),
    ("photo7.jpg", 900, 1200, "dusk", "scene"),
    ("photo8.jpg", 1200, 900, "wine", "portrait"),
    ("memory1.jpg", 1100, 850, "dusk", "scene"),
    ("memory2.jpg", 900, 1100, "night", "portrait"),
    ("memory3.jpg", 1200, 850, "wine", "scene"),
    ("memory4.jpg", 950, 1150, "dusk", "portrait"),
    ("memory5.jpg", 1100, 900, "night", "portrait"),
    ("memory6.jpg", 1000, 1000, "wine", "scene"),
    ("special1.jpg", 1200, 1000, "dusk", "portrait"),
    ("special2.jpg", 1000, 1250, "night", "portrait"),
    ("secret1.jpg", 1000, 800, "wine", "scene"),
    ("secret2.jpg", 900, 1150, "night", "portrait"),
    ("secret3.jpg", 1200, 850, "dusk", "scene"),
]
for name, w, h, pal, kind in HER_SPECS:
    cinematic_photo(os.path.join(HER, name), w, h, pal, kind)

# ---------------------------------------------------------------- wolf world
WOLF_SPECS = [
    ("luna.jpg", 900, 1150, "moon"),
    ("shadow.jpg", 900, 1150, "forest"),
    ("ghost.jpg", 900, 1150, "night"),
    ("storm.jpg", 900, 1150, "forest"),
    ("nova.jpg", 900, 1150, "moon"),
    ("winter.jpg", 900, 1150, "night"),
]
for name, w, h, pal in WOLF_SPECS:
    wolf_scene(os.path.join(WOLVES, name), w, h, palette=pal, wolves=1)

wolf_scene(os.path.join(WOLVES, "forest.jpg"), 1800, 1000, palette="forest", moon=True, wolves=2)
wolf_scene(os.path.join(WOLVES, "mountains.jpg"), 1800, 1000, palette="night", moon=True, wolves=1)
wolf_scene(os.path.join(WOLVES, "pack.jpg"), 1800, 1050, palette="moon", moon=True, wolves=3)
wolf_scene(os.path.join(WOLVES, "snow.jpg"), 1600, 1000, palette="moon", moon=True, wolves=1)
wolf_scene(os.path.join(WOLVES, "howl.jpg"), 1600, 1000, palette="forest", moon=True, wolves=1)

# a pure moon card for the interactive moon
moon_img = gradient_bg(900, 900, PALETTES["moon"])
moon_img = add_stars(moon_img, 300)
moon_img = draw_moon(moon_img, 450, 430, 250)
moon_img = add_vignette(moon_img, 0.4)
moon_img = add_grain(moon_img, 6)
moon_img.convert("RGB").save(os.path.join(WOLVES, "moon.jpg"), "JPEG", quality=88)
print("wrote", os.path.join("public/images/wolves/moon.jpg"))

# ---------------------------------------------------------------- audio
SR = 44100


def write_wav(path, samples):
    data = np.clip(samples, -1, 1)
    pcm = (data * 32767).astype(np.int16)
    with wave.open(path, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(pcm.tobytes())


def encode_mp3(wav_path, mp3_path, bitrate=128):
    import lameenc
    with wave.open(wav_path, "rb") as wf:
        n = wf.getnframes()
        raw = wf.readframes(n)
    pcm = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    enc = lameenc.Encoder()
    enc.set_bit_rate(bitrate)
    enc.set_in_sample_rate(SR)
    enc.set_channels(1)
    enc.set_quality(2)
    mp3 = enc.encode(pcm.tobytes()) + enc.flush()
    with open(mp3_path, "wb") as f:
        f.write(mp3)
    os.remove(wav_path)
    print("wrote", os.path.relpath(mp3_path, ROOT))


def tone(freq, dur, sr=SR, vol=0.5, wave_type="sine"):
    t = np.linspace(0, dur, int(round(sr * dur)), endpoint=False)
    if wave_type == "sine":
        s = np.sin(2 * np.pi * freq * t)
    elif wave_type == "triangle":
        s = 2 * np.abs(2 * ((freq * t) % 1) - 1) - 1
    else:
        s = np.sin(2 * np.pi * freq * t)
    return s * vol


def env(n, attack=0.05, release=0.4):
    a = min(int(SR * attack), n)
    r = min(int(SR * release), n)
    e = np.ones(n)
    if a > 0:
        e[:a] = np.linspace(0, 1, a)
    if r > 0:
        e[n - r:] = np.linspace(1, 0, r)
    return e


def make_background_music(path_base):
    """Soft ambient pad progression, ~32s, loopable-ish."""
    chords = [
        [130.81, 196.00, 261.63, 329.63],   # C major
        [110.00, 164.81, 220.00, 261.63],   # A minor
        [87.31, 130.81, 174.61, 220.00],    # F major
        [98.00, 146.83, 196.00, 246.94],    # G major
    ]
    seg = 8.0
    total = seg * len(chords)
    n = int(SR * total)
    out = np.zeros(n)
    for ci, chord in enumerate(chords):
        start = int(SR * ci * seg)
        end = min(n, start + int(SR * seg))
        m = end - start
        t = np.linspace(0, seg, m, endpoint=False)
        # slow swell per chord
        swell = 0.5 + 0.5 * np.sin(np.pi * t / seg)
        chord_audio = np.zeros(m)
        for f in chord:
            chord_audio += tone(f, seg, vol=0.16, wave_type="sine")
            chord_audio += tone(f * 2.001, seg, vol=0.05, wave_type="sine")
            chord_audio += tone(f * 0.5, seg, vol=0.08, wave_type="triangle")
        # gentle shimmer
        shimmer = tone(1046.5, seg, vol=0.02) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.25 * t))
        seg_audio = (chord_audio + shimmer) * swell * env(m, attack=1.2, release=1.6)
        # crossfade with previous
        fade = int(SR * 1.0)
        if start > 0:
            seg_audio[:fade] *= np.linspace(0, 1, fade)
            out[start:start + fade] = out[start:start + fade] * np.linspace(1, 0, fade) + seg_audio[:fade]
            out[start + fade:end] = seg_audio[fade:]
        else:
            out[start:end] = seg_audio
    # sparkle notes
    for _ in range(60):
        at = random.uniform(0, total - 0.5)
        f = random.choice([523.25, 659.25, 783.99, 1046.5, 1318.5])
        d = random.uniform(0.4, 1.4)
        s = int(at * SR)
        e = min(n, s + int(SR * d))
        note = tone(f, (e - s) / SR, vol=random.uniform(0.03, 0.07)) * env(e - s, 0.02, 0.5)
        out[s:e] += note
    out /= max(1.0, np.abs(out).max()) * 1.15
    wav = path_base + ".wav"
    write_wav(wav, out)
    encode_mp3(wav, path_base + ".mp3")


def make_click(path_base):
    n = int(SR * 0.12)
    t = np.linspace(0, 0.12, n, endpoint=False)
    s = np.sin(2 * np.pi * 880 * t) * np.exp(-t * 60) * 0.25
    s += np.sin(2 * np.pi * 1320 * t) * np.exp(-t * 90) * 0.12
    write_wav(path_base + ".wav", s)
    encode_mp3(path_base + ".wav", path_base + ".mp3", bitrate=96)


def make_open(path_base):
    """Envelope whoosh."""
    n = int(SR * 0.9)
    t = np.linspace(0, 0.9, n, endpoint=False)
    noise = np.random.uniform(-1, 1, n)
    # lowpass-ish via moving average
    k = 24
    noise = np.convolve(noise, np.ones(k) / k, mode="same")
    s = noise * (0.35 * np.sin(np.pi * t / 0.9)) * env(n, 0.05, 0.3)
    nt = int(SR * 0.5)
    note = tone(196, 0.5, vol=0.12) * env(nt, 0.05, 0.4)
    s[:nt] += note
    write_wav(path_base + ".wav", s)
    encode_mp3(path_base + ".wav", path_base + ".mp3", bitrate=96)


def make_secret(path_base):
    """Magical chime."""
    notes = [523.25, 659.25, 783.99, 1046.5]
    parts = []
    for i, f in enumerate(notes):
        d = 0.7
        s = tone(f, d, vol=0.22) * env(int(round(SR * d)), 0.01, 0.6)
        parts.append((i * 0.12, s))
    n = int(SR * 1.6)
    out = np.zeros(n)
    for at, s in parts:
        st = int(at * SR)
        en = min(n, st + len(s))
        out[st:en] += s[:en - st]
    sparkle = tone(1568, 1.4, vol=0.08) * env(int(round(SR * 1.4)), 0.01, 1.2)
    out[:len(sparkle)] += sparkle
    write_wav(path_base + ".wav", out / max(1, np.abs(out).max()))
    encode_mp3(path_base + ".wav", path_base + ".mp3", bitrate=96)


def make_howl(path_base):
    """Stylized wolf howl: pitch-swept filtered wail."""
    dur = 3.2
    n = int(SR * dur)
    t = np.linspace(0, dur, n, endpoint=False)
    # fundamental sweep: starts low, rises, long sustain, falls
    f0 = 180 + 260 * (1 - np.exp(-t * 2.2)) * np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 0.5
    f0 += 60 * np.sin(2 * np.pi * 5.5 * t) * np.exp(-((t - 1.4) ** 2) / 0.4)  # vibrato
    phase = 2 * np.pi * np.cumsum(f0) / SR
    harm = (np.sin(phase) * 0.6 + np.sin(2 * phase) * 0.25 + np.sin(3 * phase) * 0.12
            + np.sin(1.5 * phase) * 0.1)
    # breathy noise component
    noise = np.random.uniform(-1, 1, n)
    k = 30
    noise = np.convolve(noise, np.ones(k) / k, mode="same")
    s = harm * 0.7 + noise * 0.25
    shape = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 0.8
    s = s * shape * env(n, attack=0.35, release=0.7) * 0.85
    # echo
    out = s.copy()
    for delay, gain in [(0.45, 0.35), (0.95, 0.18)]:
        st = int(delay * SR)
        out[st:] += s[:-st] * gain
    out /= max(1.0, np.abs(out).max())
    write_wav(path_base + ".wav", out)
    encode_mp3(path_base + ".wav", path_base + ".mp3", bitrate=128)


def make_transition(path_base):
    n = int(SR * 0.5)
    t = np.linspace(0, 0.5, n, endpoint=False)
    s = np.sin(2 * np.pi * (220 + 440 * t / 0.5) * t) * np.exp(-t * 8) * 0.2
    s += np.random.uniform(-1, 1, n) * 0.03 * np.exp(-t * 10)
    write_wav(path_base + ".wav", s)
    encode_mp3(path_base + ".wav", path_base + ".mp3", bitrate=96)


make_background_music(os.path.join(AUDIO, "background"))
make_click(os.path.join(AUDIO, "click"))
make_open(os.path.join(AUDIO, "open"))
make_secret(os.path.join(AUDIO, "secret"))
make_howl(os.path.join(AUDIO, "howl"))
make_transition(os.path.join(AUDIO, "transition"))

print("ALL ASSETS GENERATED")
