import os
import subprocess
import shutil

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROMO_DIR = os.path.join(BASE_DIR, 'promo_video')
STORYBOARD_DIR = os.path.join(PROMO_DIR, 'storyboard')
PUBLIC_VIDEOS_DIR = os.path.join(BASE_DIR, 'public', 'videos')
TMP_DIR = '/tmp/edumind_video'

os.makedirs(TMP_DIR, exist_ok=True)
os.makedirs(PUBLIC_VIDEOS_DIR, exist_ok=True)

img1 = os.path.join(STORYBOARD_DIR, '01_estudante_foco.jpg')
img2 = os.path.join(STORYBOARD_DIR, '02_prof_pacavira.jpg')
img3 = os.path.join(STORYBOARD_DIR, '03_pomodoro_dashboard.jpg')

# Step 1: Create composite 1920x1080 static frame for each scene
print("1. Creating composite slide frames...")
# Frame 1
subprocess.run([
    'ffmpeg', '-y',
    '-i', img1,
    '-i', f'{TMP_DIR}/overlay1.png',
    '-filter_complex',
    '[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080[bg];[bg][1:v]overlay=0:0[v]',
    '-map', '[v]',
    f'{TMP_DIR}/frame1.png'
], check=True)

# Frame 2
subprocess.run([
    'ffmpeg', '-y',
    '-i', img2,
    '-i', f'{TMP_DIR}/overlay2.png',
    '-filter_complex',
    '[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080[bg];[bg][1:v]overlay=0:0[v]',
    '-map', '[v]',
    f'{TMP_DIR}/frame2.png'
], check=True)

# Frame 3
subprocess.run([
    'ffmpeg', '-y',
    '-i', img3,
    '-i', f'{TMP_DIR}/overlay3.png',
    '-filter_complex',
    '[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080[bg];[bg][1:v]overlay=0:0[v]',
    '-map', '[v]',
    f'{TMP_DIR}/frame3.png'
], check=True)

# Frame 4
subprocess.run([
    'ffmpeg', '-y',
    '-i', f'{TMP_DIR}/overlay4.png',
    '-filter_complex',
    '[0:v]scale=1920:1080[v]',
    '-map', '[v]',
    f'{TMP_DIR}/frame4.png'
], check=True)

# Copy the high-res composite frames to promo_video/storyboard so user has the full slides!
shutil.copyfile(f'{TMP_DIR}/frame1.png', os.path.join(STORYBOARD_DIR, 'cena1_estudante_foco.png'))
shutil.copyfile(f'{TMP_DIR}/frame2.png', os.path.join(STORYBOARD_DIR, 'cena2_prof_pacavira.png'))
shutil.copyfile(f'{TMP_DIR}/frame3.png', os.path.join(STORYBOARD_DIR, 'cena3_pomodoro_dashboard.png'))
shutil.copyfile(f'{TMP_DIR}/frame4.png', os.path.join(STORYBOARD_DIR, 'cena4_edumind_cta.png'))

print("2. Encoding 7-second scene clips...")
for i in range(1, 5):
    subprocess.run([
        'ffmpeg', '-y',
        '-loop', '1', '-t', '7.0',
        '-i', f'{TMP_DIR}/frame{i}.png',
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-tune', 'stillimage',
        '-pix_fmt', 'yuv420p',
        '-r', '30',
        f'{TMP_DIR}/clip{i}.mp4'
    ], check=True)

print("3. Concatenating clips with smooth crossfade...")
# Total: 4 clips of 7s = 28s minus 3 crossfades of 0.6s = 26.2s
subprocess.run([
    'ffmpeg', '-y',
    '-i', f'{TMP_DIR}/clip1.mp4',
    '-i', f'{TMP_DIR}/clip2.mp4',
    '-i', f'{TMP_DIR}/clip3.mp4',
    '-i', f'{TMP_DIR}/clip4.mp4',
    '-filter_complex',
    '[0:v][1:v]xfade=transition=fade:duration=0.6:offset=6.4[v1];'
    '[v1][2:v]xfade=transition=fade:duration=0.6:offset=12.8[v2];'
    '[v2][3:v]xfade=transition=fade:duration=0.6:offset=19.2[vfinal]',
    '-map', '[vfinal]',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-pix_fmt', 'yuv420p',
    '-r', '30',
    f'{TMP_DIR}/video_silent.mp4'
], check=True)

print("4. Generating musical soundtrack...")
subprocess.run([
    'ffmpeg', '-y',
    '-f', 'lavfi',
    '-i',
    'aevalsrc=exprs=\''
    '0.18*sin(2*PI*261.63*t)*(1+0.2*sin(2*PI*4*t)) + '
    '0.14*sin(2*PI*329.63*t)*(1+0.2*cos(2*PI*3*t)) + '
    '0.14*sin(2*PI*392.00*t)*(1+0.2*sin(2*PI*2*t)) + '
    '0.10*sin(2*PI*523.25*t)*(1+0.3*sin(2*PI*6*t)) + '
    '0.06*sin(2*PI*130.81*t)*cos(2*PI*2*t)\':s=44100:d=26',
    '-af', 'afade=t=in:ss=0:d=1.5,afade=t=out:st=24:d=2',
    '-c:a', 'aac', '-b:a', '192k',
    f'{TMP_DIR}/soundtrack.m4a'
], check=True)

output_promo = os.path.join(PROMO_DIR, 'edumind_publicidade_1080p.mp4')
output_public = os.path.join(PUBLIC_VIDEOS_DIR, 'edumind_publicidade_1080p.mp4')

print(f"5. Final muxing to {output_promo}...")
subprocess.run([
    'ffmpeg', '-y',
    '-i', f'{TMP_DIR}/video_silent.mp4',
    '-i', f'{TMP_DIR}/soundtrack.m4a',
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-shortest',
    output_promo
], check=True)

shutil.copyfile(output_promo, output_public)
print("SUCCESS! Video generation finished without errors.")
