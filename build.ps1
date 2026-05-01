$css = Get-Content -Encoding UTF8 'style.css'

$base = $css[0..256] -join "`n"
$indexSpecific = $css[257..531] -join "`n"
$authSpecific = ($css[532..674] + $css[900..993]) -join "`n"
$dashSpecific = $css[675..852] -join "`n"

$respIndex = @"
/* Responsive for Index */
@media (max-width: 1024px) {
  .cards-grid     { grid-template-columns: repeat(3, 1fr); }
  .contact-row    { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 900px) {
  .two-col, .two-col.reverse { flex-direction: column; }
  .cards-grid { grid-template-columns: repeat(2, 1fr); }
  .dentists-row { flex-direction: column; align-items: center; }
  .hero-text h1 { font-size: 2.3rem; }
  .hero-img-real, .about-img-real { max-width: 100%; height: 270px; }
  .nav-list { display: none; }
  .hero-section { padding: 60px 0 0; }
}
@media (max-width: 600px) {
  .container { padding: 0 16px; }
  .cards-grid { grid-template-columns: 1fr; }
  .contact-row { grid-template-columns: 1fr; }
  .stats-row { flex-direction: column; gap: 1.5rem; }
  .stat-divider { display: none; }
  .hero-text h1 { font-size: 1.9rem; }
  .section-header h2 { font-size: 1.6rem; }
  .about-text h2 { font-size: 1.6rem; }
}
@media (max-width: 400px) {
  .btn-group { flex-direction: column; }
  .btn-primary, .btn-outline { width: 100%; justify-content: center; }
}
/* Utility classes replacing inline styles */
.mt-1-5 { margin-top: 1.5rem; }
.inline-block { display: inline-block; }
.flex-center { display: flex; justify-content: center; }
"@

$respLogin = @"
/* Responsive for Login */
@media (max-width: 900px) {
  .auth-wrapper { grid-template-columns: 1fr; height: auto; }
  .auth-left { display: none; }
}
@media (max-width: 600px) {
  .field-row { grid-template-columns: 1fr; }
}
@media (max-width: 400px) {
  .btn-primary, .btn-outline { width: 100%; justify-content: center; }
}
/* CSS Target Logic relocated from HTML */
.form-box { display: none !important; }
.auth-right:not(:has(.form-box:target)) #login-form { display: flex !important; }
.form-box:target { display: flex !important; }
.recover-label { cursor: pointer; display: block; margin: 0; }
.recover-label:has(input:checked) .recover-card { border-color: var(--primary); background: var(--primary-lighter); box-shadow: 0 0 0 3px rgba(74, 155, 142, .12); }
/* Utility classes replacing inline styles */
.text-right { text-align: right; }
.mt-0-25 { margin-top: 0.25rem; }
.mt-10px { margin-top: 10px !important; }
.flex-center { display: flex; justify-content: center; }
.hidden-radio { display: none; }
"@

$respDash = @"
/* Responsive for Dashboard */
@media (max-width: 900px) {
  .dash-cards { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .dash-cards { grid-template-columns: 1fr 1fr; }
  .sidebar { width: 100%; height: auto; position: relative; }
  .dash-main { margin-left: 0; max-width: 100%; padding: 1.2rem 1rem 3rem; }
  .dash-page { flex-direction: column; }
  .dash-section { padding: 1.3rem 1.1rem; }
}
@media (max-width: 400px) {
  .btn-primary, .btn-outline { width: 100%; justify-content: center; }
}
"@

$styleOut = $base + "`n" + $indexSpecific + "`n" + $respIndex
$loginOut = $base + "`n" + $authSpecific + "`n" + $respLogin
$dashOut = $base + "`n" + $dashSpecific + "`n" + $respDash

Set-Content -Path 'style.css' -Value $styleOut -Encoding UTF8
Set-Content -Path 'login.css' -Value $loginOut -Encoding UTF8
Set-Content -Path 'dashboard.css' -Value $dashOut -Encoding UTF8
