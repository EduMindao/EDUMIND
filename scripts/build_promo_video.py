import os
import subprocess
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROMO_DIR = os.path.join(BASE_DIR, 'promo_video')
STORYBOARD_DIR = os.path.join(PROMO_DIR, 'storyboard')
PUBLIC_VIDEOS_DIR = os.path.join(BASE_DIR, 'public', 'videos')
TMP_DIR = '/tmp/edumind_video'

os.makedirs(TMP_DIR, exist_ok=True)
os.makedirs(PUBLIC_VIDEOS_DIR, exist_ok=True)

# Scene 1 SVG Overlay
svg_scene1 = """<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.0"/>
      <stop offset="40%" stop-color="#000000" stop-opacity="0.2"/>
      <stop offset="75%" stop-color="#080C16" stop-opacity="0.88"/>
      <stop offset="100%" stop-color="#050811" stop-opacity="0.96"/>
    </linearGradient>
    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#4F46E5"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#EAB308"/>
    </linearGradient>
  </defs>

  <!-- Fullscreen Gradient Vignette -->
  <rect width="1920" height="1080" fill="url(#bgGrad)"/>

  <!-- Top Header Badge -->
  <g transform="translate(100, 70)">
    <rect width="460" height="52" rx="26" fill="url(#badgeGrad)"/>
    <circle cx="30" cy="26" r="16" fill="#FFFFFF" fill-opacity="0.25"/>
    <text x="30" y="32" font-family="Liberation Sans, sans-serif" font-weight="bold" font-size="20" fill="#FFFFFF" text-anchor="middle">AO</text>
    <text x="60" y="33" font-family="Liberation Sans, sans-serif" font-weight="bold" font-size="19" fill="#FFFFFF" letter-spacing="1.5">EDUMIND.AO • ESTUDO INTELIGENTE</text>
  </g>

  <!-- Bottom Lower Third Glass Card -->
  <g transform="translate(100, 680)">
    <!-- Glass card container -->
    <rect width="1720" height="320" rx="28" fill="#0B132B" fill-opacity="0.88" stroke="#3B82F6" stroke-width="2" stroke-opacity="0.4"/>
    
    <!-- Accent Pill -->
    <rect x="50" y="45" width="230" height="36" rx="18" fill="url(#goldGrad)"/>
    <text x="165" y="69" font-family="Liberation Sans, sans-serif" font-weight="bold" font-size="16" fill="#1E1B4B" text-anchor="middle" letter-spacing="1">DIFICULDADES NOS ESTUDOS?</text>

    <!-- Main Headline -->
    <text x="50" y="140" font-family="Liberation Sans, sans-serif" font-weight="bold" font-size="46" fill="#FFFFFF">Cansado de estudar horas a fio sem reter a matéria?</text>

    <!-- Subtitle -->
    <text x="50" y="200" font-family="Liberation Sans, sans-serif" font-weight="normal" font-size="28" fill="#93C5FD">Aprende de forma mais inteligente, retém o conhecimento e alcança notas de excelência!</text>

    <!-- Mini Feature Badges -->
    <g transform="translate(50, 240)">
      <rect x="0" y="0" width="240" height="42" rx="21" fill="#1E293B" fill-opacity="0.9" stroke="#60A5FA" stroke-width="1.5"/>
      <text x="120" y="27" font-family="Liberation Sans, sans-serif" font-weight="bold" font-size="17" fill="#60A5FA" text-anchor="middle">🎯 Foco Máximo</text>

      <rect x="260" y="0" width="260" height="42" rx="21" fill="#1E293B" fill-opacity="0.9" stroke="#34D399" stroke-width="1.5"/>
      <text x="390" y="27" font-family="Liberation Sans, sans-serif" font-weight="bold" font-size="17" fill="#34D399" text-anchor="middle">⚡ Alta Retenção Ativa</text>

      <rect x="540" y="0" width="280" height="42" rx="21" fill="#1E293B" fill-opacity="0.9" stroke="#FBBF24" stroke-width="1.5"/>
      <text x="680" y="27" font-family="Liberation Sans, sans-serif" font-weight="bold" font-size="17" fill="#FBBF24" text-anchor="middle">📈 Melhores Resultados</text>
    </g>
  </g>
</svg>
"""

# Scene 2 SVG Overlay - Prof. Pacavira
svg_scene2 = """<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.0"/>
      <stop offset="35%" stop-color="#000000" stop-opacity="0.15"/>
      <stop offset="70%" stop-color="#080C16" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#050811" stop-opacity="0.96"/>
    </linearGradient>
    <linearGradient id="profBadgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#6366F1"/>
    </linearGradient>
  </defs>

  <rect width="1920" height="1080" fill="url(#bgGrad)"/>

  <!-- Top Header Badge -->
  <g transform="translate(100, 70)">
    <rect width="520" height="52" rx="26" fill="url(#profBadgeGrad)"/>
    <text x="260" y="33" font-family="Liberation Sans, sans-serif" font-weight="bold" font-size="18" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">💡 CONHEÇA O SEU TUTOR VIRTUAL COM IA</text>
  </g>

  <!-- Bottom Lower Third Glass Card -->
  <g transform="translate(100, 680)">
    <rect width="1720" height="320" rx="28" fill="#0B132B" fill-opacity="0.88" stroke="#10B981" stroke-width="2" stroke-opacity="0.5"/>

    <!-- Accent Pill -->
    <rect x="50" y="45" width="220" height="36" rx="18" fill="url(#blueGrad)"/>
    <text x="160" y="69" font-family="Liberation Sans, sans-serif" font-weight="bold" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">PROF. PACAVIRA</text>

    <!-- Main Headline -->
    <text x="50" y="140" font-family="Liberation Sans, sans-serif" font-weight="bold" font-size="46" fill="#FFFFFF">O teu Mentor Pessoal e Interativo 24 horas por dia</text>

    <!-- Subtitle -->
    <text x="50" y="200" font-family="Liberation Sans, sans-serif" font-weight="normal" font-size="28" fill="#A7F3D0">Explicações claras, linguagem adaptada e respostas dinâmicas para qualquer disciplina!</text>

    <!-- Mini Feature Badges -->
    <g transform="translate(50, 240)">
      <rect x="0" y="0" width="240" height="42" rx="21" fill="#1E293B" fill-opacity="0.9" stroke="#34D399" stroke-width="1.5"/>
      <text x="120" y="27" font-family="Liberation Sans, sans-serif" font-weight="bold" font-size="17" fill="#34D399" text-anchor="middle">🎒 Ensino Primário</text>

      <rect x="260" y="0" width="270" height="42" rx="21" fill="#1E293B" fill-opacity="0.9" stroke="#60A5FA" stroke-width="1.5"/>
      <text x="395" y="27" font-family="Liberation Sans, sans-serif" font-weight="bold" font-size="17" fill="#60A5FA" text-anchor="middle">📐 Ensino Médio &amp; Exames</text>

      <rect x="550" y="0" width="260" height="42" rx="21" fill="#1E293B" fill-opacity="0.9" stroke="#C084FC" stroke-width="1.5"/>
      <text x="680" y="27" font-family="Liberation Sans, sans-serif" font-weight="bold" font-size="17" fill="#C084FC" text-anchor="middle">🎓 Ensino Universitário</text>
    </g>
  </g>
</svg>
"""

# Scene 3 SVG Overlay - Pomodoro & Summaries
svg_scene3 = """<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.0"/>
      <stop offset="35%" stop-color="#000000" stop-opacity="0.15"/>
      <stop offset="70%" stop-color="#080C16" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#050811" stop-opacity="0.96"/>
    </linearGradient>
    <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F97316"/>
      <stop offset="100%" stop-color="#EF4444"/>
    </linearGradient>
  </defs>

  <rect width="1920" height="1080" fill="url(#bgGrad)"/>

  <!-- Top Header Badge -->
  <g transform="translate(100, 70)">
    <rect width="480" height="52" rx="26" fill="url(#orangeGrad)"/>
    <text x="240" y="33" font-family="Liberation Sans, sans-serif" font-weight="bold" font-size="18" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">⏱️ MÉTODO POMODORO &amp; FIXAÇÃO ATIVA</text>
  </g>

  <!-- Bottom Lower Third Glass Card -->
  <g transform="translate(100, 680)">
    <rect width="1720" height="320" rx="28" fill="#0B132B" fill-opacity="0.88" stroke="#F97316" stroke-width="2" stroke-opacity="0.5"/>

    <!-- Accent Pill -->
    <rect x="50" y="45" width="260" height="36" rx="18" fill="url(#orangeGrad)"/>
    <text x="180" y="69" font-family="Liberation Sans, sans-serif" font-weight="bold" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">PRODUTIVIDADE COMPROVADA</text>

    <!-- Main Headline -->
    <text x="50" y="140" font-family="Liberation Sans, sans-serif" font-weight="bold" font-size="46" fill="#FFFFFF">Técnica Pomodoro + Resumos e Tarefas Automáticas</text>

    <!-- Subtitle -->
    <text x="50" y="200" font-family="Liberation Sans, sans-serif" font-weight="normal" font-size="28" fill="#FED7AA">Termine a aula e receba na hora um resumo completo e exercícios práticos para fixar!</text>

    <!-- Mini Feature Badges -->
    <g transform="translate(50, 240)">
      <rect x="0" y="0" width="240" height="42" rx="21" fill="#1E293B" fill-opacity="0.9" stroke="#FB923C" stroke-width="1.5"/>
      <text x="120" y="27" font-family="Liberation Sans, sans-serif" font-weight="bold" font-size="17" fill="#FB923C" text-anchor="middle">⏱️ Ciclos de 25 Minutos</text>

      <rect x="260" y="0" width="280" height="42" rx="21" fill="#1E293B" fill-opacity="0.9" stroke="#60A5FA" stroke-width="1.5"/>
      <text x="400" y="27" font-family="Liberation Sans, sans-serif" font-weight="bold" font-size="17" fill="#60A5FA" text-anchor="middle">📝 Resumos em Markdown</text>

      <rect x="560" y="0" width="280" height="42" rx="21" fill="#1E293B" fill-opacity="0.9" stroke="#34D399" stroke-width="1.5"/>
      <text x="700" y="27" font-family="Liberation Sans, sans-serif" font-weight="bold" font-size="17" fill="#34D399" text-anchor="middle">✅ Quizzes com Gabarito</text>
    </g>
  </g>
</svg>
"""

# Scene 4 SVG - Epic Billboard & Call to Action
svg_scene4 = """<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="epicGlow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#1E3A8A" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#0F172A" stop-opacity="0.98"/>
      <stop offset="100%" stop-color="#030712" stop-opacity="1.0"/>
    </radialGradient>
    <linearGradient id="btnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2563EB"/>
      <stop offset="50%" stop-color="#4F46E5"/>
      <stop offset="100%" stop-color="#7C3AED"/>
    </linearGradient>
    <linearGradient id="textGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FCD34D"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
  </defs>

  <!-- Background with ambient glow -->
  <rect width="1920" height="1080" fill="url(#epicGlow)"/>

  <!-- Glowing background circles -->
  <circle cx="960" cy="380" r="320" fill="#3B82F6" fill-opacity="0.08"/>
  <circle cx="960" cy="380" r="220" fill="#6366F1" fill-opacity="0.12"/>

  <!-- Center Card -->
  <g transform="translate(260, 160)">
    <!-- Logo Badge -->
    <rect x="580" y="30" width="240" height="56" rx="28" fill="#1E293B" stroke="#3B82F6" stroke-width="2"/>
    <text x="700" y="67" font-family="Liberation Sans, sans-serif" font-weight="bold" font-size="24" fill="#60A5FA" text-anchor="middle">🎓 EduMind.AO</text>

    <!-- Super Headline -->
    <text x="700" y="180" font-family="Liberation Sans, sans-serif" font-weight="bold" font-size="64" fill="#FFFFFF" text-anchor="middle">O Teu Sucesso Académico</text>
    <text x="700" y="260" font-family="Liberation Sans, sans-serif" font-weight="bold" font-size="64" fill="url(#textGold)" text-anchor="middle">Começa Agora!</text>

    <!-- Subtitle text -->
    <text x="700" y="340" font-family="Liberation Sans, sans-serif" font-weight="normal" font-size="30" fill="#CBD5E1" text-anchor="middle">A plataforma feita para transformar os teus estudos e garantir as melhores notas.</text>

    <!-- Call to Action Button -->
    <g transform="translate(410, 420)">
      <rect width="580" height="84" rx="42" fill="url(#btnGrad)" stroke="#93C5FD" stroke-width="2"/>
      <text x="290" y="53" font-family="Liberation Sans, sans-serif" font-weight="bold" font-size="28" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">COMEÇAR A ESTUDAR AGORA ➔</text>
    </g>

    <!-- Trust badges below button -->
    <g transform="translate(180, 560)">
      <text x="520" y="30" font-family="Liberation Sans, sans-serif" font-weight="normal" font-size="22" fill="#94A3B8" text-anchor="middle">✨ Gratuito • Funciona no Computador, Tablet e Telemóvel • Modo Claro &amp; Escuro</text>
    </g>
  </g>
</svg>
"""

# Save SVGs
with open(f'{TMP_DIR}/overlay1.svg', 'w', encoding='utf-8') as f:
    f.write(svg_scene1)
with open(f'{TMP_DIR}/overlay2.svg', 'w', encoding='utf-8') as f:
    f.write(svg_scene2)
with open(f'{TMP_DIR}/overlay3.svg', 'w', encoding='utf-8') as f:
    f.write(svg_scene3)
with open(f'{TMP_DIR}/overlay4.svg', 'w', encoding='utf-8') as f:
    f.write(svg_scene4)

print("Rendering SVG overlays to PNG...")
for i in range(1, 5):
    cmd = ['ffmpeg', '-y', '-i', f'{TMP_DIR}/overlay{i}.svg', f'{TMP_DIR}/overlay{i}.png']
    subprocess.run(cmd, check=True)

img1 = os.path.join(STORYBOARD_DIR, '01_estudante_foco.jpg')
img2 = os.path.join(STORYBOARD_DIR, '02_prof_pacavira.jpg')
img3 = os.path.join(STORYBOARD_DIR, '03_pomodoro_dashboard.jpg')

# Render Scene 1: (Duration 7.5s) Ken Burns zoom on student + Overlay
print("Rendering Scene 1...")
cmd_s1 = [
    'ffmpeg', '-y',
    '-loop', '1', '-t', '7.5', '-i', img1,
    '-loop', '1', '-t', '7.5', '-i', f'{TMP_DIR}/overlay1.png',
    '-filter_complex',
    '[0:v]scale=2160x1215,zoompan=z=\'min(zoom+0.0006,1.15)\':x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\':d=225:s=1920x1080:fps=30[bg];'
    '[bg][1:v]overlay=0:0[v]',
    '-map', '[v]',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
    f'{TMP_DIR}/scene1.mp4'
]
subprocess.run(cmd_s1, check=True)

# Render Scene 2: (Duration 7.5s) Ken Burns zoom on Prof Pacavira + Overlay
print("Rendering Scene 2...")
cmd_s2 = [
    'ffmpeg', '-y',
    '-loop', '1', '-t', '7.5', '-i', img2,
    '-loop', '1', '-t', '7.5', '-i', f'{TMP_DIR}/overlay2.png',
    '-filter_complex',
    '[0:v]scale=2160x1215,zoompan=z=\'min(zoom+0.0005,1.12)\':x=\'iw/2-(iw/zoom/2)\':y=\'ih/3-(ih/zoom/3)\':d=225:s=1920x1080:fps=30[bg];'
    '[bg][1:v]overlay=0:0[v]',
    '-map', '[v]',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
    f'{TMP_DIR}/scene2.mp4'
]
subprocess.run(cmd_s2, check=True)

# Render Scene 3: (Duration 7.5s) Ken Burns on Dashboard + Overlay
print("Rendering Scene 3...")
cmd_s3 = [
    'ffmpeg', '-y',
    '-loop', '1', '-t', '7.5', '-i', img3,
    '-loop', '1', '-t', '7.5', '-i', f'{TMP_DIR}/overlay3.png',
    '-filter_complex',
    '[0:v]scale=2160x1215,zoompan=z=\'min(zoom+0.0006,1.14)\':x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\':d=225:s=1920x1080:fps=30[bg];'
    '[bg][1:v]overlay=0:0[v]',
    '-map', '[v]',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
    f'{TMP_DIR}/scene3.mp4'
]
subprocess.run(cmd_s3, check=True)

# Render Scene 4: (Duration 7.5s) Final CTA Billboard with subtle pulse
print("Rendering Scene 4...")
cmd_s4 = [
    'ffmpeg', '-y',
    '-loop', '1', '-t', '7.5', '-i', f'{TMP_DIR}/overlay4.png',
    '-filter_complex',
    '[0:v]scale=1920x1080,fps=30[v]',
    '-map', '[v]',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
    f'{TMP_DIR}/scene4.mp4'
]
subprocess.run(cmd_s4, check=True)

# Concatenate scenes with smooth crossfade transitions
# Total duration: 4 scenes * 7.5s - 3 transitions * 0.8s = 27.6s ~ 28s
print("Applying transitions between scenes...")
cmd_xfade = [
    'ffmpeg', '-y',
    '-i', f'{TMP_DIR}/scene1.mp4',
    '-i', f'{TMP_DIR}/scene2.mp4',
    '-i', f'{TMP_DIR}/scene3.mp4',
    '-i', f'{TMP_DIR}/scene4.mp4',
    '-filter_complex',
    '[0:v][1:v]xfade=transition=fade:duration=0.8:offset=6.7[v01];'
    '[v01][2:v]xfade=transition=fade:duration=0.8:offset=13.4[v02];'
    '[v02][3:v]xfade=transition=fade:duration=0.8:offset=20.1[vfinal]',
    '-map', '[vfinal]',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
    f'{TMP_DIR}/video_silent.mp4'
]
subprocess.run(cmd_xfade, check=True)

# Generate an upbeat, harmonic ambient soundtrack with acoustic chords and rhythmic accents
print("Generating harmonic soundtrack...")
cmd_audio = [
    'ffmpeg', '-y',
    '-f', 'lavfi',
    '-i',
    'aevalsrc=exprs=\''
    '0.18*sin(2*PI*261.63*t)*(1+0.2*sin(2*PI*4*t)) + '     # C4 note
    '0.14*sin(2*PI*329.63*t)*(1+0.2*cos(2*PI*3*t)) + '     # E4 note
    '0.14*sin(2*PI*392.00*t)*(1+0.2*sin(2*PI*2*t)) + '     # G4 note
    '0.10*sin(2*PI*523.25*t)*(1+0.3*sin(2*PI*6*t)) + '     # C5 chime
    '0.06*sin(2*PI*130.81*t)*cos(2*PI*2*t)\':s=44100:d=27', # C3 bass
    '-af', 'afade=t=in:ss=0:d=1.5,afade=t=out:st=25:d=2',
    '-c:a', 'aac', '-b:a', '192k',
    f'{TMP_DIR}/soundtrack.m4a'
]
subprocess.run(cmd_audio, check=True)

# Merge video and audio into final production MP4
output_promo = os.path.join(PROMO_DIR, 'edumind_publicidade_1080p.mp4')
output_public = os.path.join(PUBLIC_VIDEOS_DIR, 'edumind_publicidade_1080p.mp4')

print(f"Muxing final video to {output_promo}...")
cmd_final = [
    'ffmpeg', '-y',
    '-i', f'{TMP_DIR}/video_silent.mp4',
    '-i', f'{TMP_DIR}/soundtrack.m4a',
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-shortest',
    output_promo
]
subprocess.run(cmd_final, check=True)

# Also copy to public/videos for direct streaming in web app
import shutil
shutil.copyfile(output_promo, output_public)

print("Video successfully generated!")
print(f"File 1: {output_promo}")
print(f"File 2: {output_public}")
