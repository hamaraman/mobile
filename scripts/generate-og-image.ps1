# 기본 OG 이미지(1200x630)를 생성한다. 사진을 넣지 않은 청첩장의 링크 미리보기 폴백용.
# Windows 내장 GDI+(System.Drawing)로 실제 폰트를 렌더링하므로 문구까지 넣을 수 있다.
# 실행(Windows PowerShell 5.1 권장):
#   powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/generate-og-image.ps1

Add-Type -AssemblyName System.Drawing

$W = 1200
$H = 630
$bmp = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# 팔레트
$cTop    = [System.Drawing.Color]::FromArgb(253, 251, 247)  # 크림(상단)
$cBottom = [System.Drawing.Color]::FromArgb(244, 235, 230)  # 따뜻한 톤(하단)
$gold    = [System.Drawing.Color]::FromArgb(197, 162, 110)
$rose    = [System.Drawing.Color]::FromArgb(184, 142, 142)
$ink     = [System.Drawing.Color]::FromArgb(120, 100, 96)
$inkSoft = [System.Drawing.Color]::FromArgb(150, 120, 100, 96)

# 1) 세로 그라데이션 배경
$rect = New-Object System.Drawing.Rectangle(0, 0, $W, $H)
$bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $cTop, $cBottom, 90)
$g.FillRectangle($bg, $rect)

# 2) 가는 안쪽 테두리
$penFrame = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(70, 120, 100, 96), 1)
$g.DrawRectangle($penFrame, 48, 48, ($W - 96), ($H - 96))

# 3) 겹친 웨딩 링 두 개
$penGold = New-Object System.Drawing.Pen($gold, 9)
$penRose = New-Object System.Drawing.Pen($rose, 9)
# 중심 y=250, 반지름 95 → 박스 좌상단 y=155, 크기 190
$g.DrawEllipse($penGold, 452, 155, 190, 190)  # 중심 547
$g.DrawEllipse($penRose, 558, 155, 190, 190)  # 중심 653

# 가운데 정렬 포맷
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center

function Draw-Text($text, $family, $sizePx, $style, $color, $y) {
  $font = New-Object System.Drawing.Font($family, [single]$sizePx, $style, [System.Drawing.GraphicsUnit]::Pixel)
  $brush = New-Object System.Drawing.SolidBrush($color)
  $g.DrawString($text, $font, $brush, [single]($W / 2), [single]$y, $sf)
  $font.Dispose(); $brush.Dispose()
}

$reg = [System.Drawing.FontStyle]::Regular

# 4) 상단 영문 (자간 넓힌 느낌으로 공백 삽입)
Draw-Text 'W E D D I N G   I N V I T A T I O N' 'Georgia' 22 $reg $inkSoft 92

# 5) 메인 문구 (한글 세리프 — 바탕, 없으면 기본 폰트로 폴백)
Draw-Text '결혼합니다' '바탕' 70 $reg $ink 392

# 6) 보조 문구
Draw-Text '소중한 분들을 저희 두 사람의 결혼식에 모십니다' 'Malgun Gothic' 22 $reg $inkSoft 492

# 저장
$outDir = Join-Path $PSScriptRoot '..\public'
$out = Join-Path $outDir 'og-image.png'
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Output "wrote $out ($W x $H)"
