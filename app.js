document.getElementById('email-display').textContent = ['Kreid','gcusd.com'].join('@');

function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });

  const margin = 60;
  const pageW = 612;
  const pageH = 792;
  const contentW = pageW - margin * 2;
  let y = margin;

  function checkPage(needed) {
    needed = needed || 20;
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  }

  function drawPageNum(num) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(num + ' | P a g e', pageW - margin, margin - 20, { align: 'right' });
    doc.setTextColor(30);
  }

  function sectionHeader(title) {
    checkPage(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(26, 58, 92);
    var lines = doc.splitTextToSize(title.toUpperCase(), contentW);
    lines.forEach(function(line) {
      doc.text(line, pageW / 2, y, { align: 'center' });
      y += 16;
    });
    doc.setDrawColor(26, 58, 92);
    doc.setLineWidth(1.5);
    doc.line(margin, y, pageW - margin, y);
    y += 14;
    doc.setTextColor(30);
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
  }

  function fieldLine(label, value) {
    checkPage(28);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(label.toUpperCase(), margin, y);
    y += 11;
    doc.setFontSize(10.5);
    doc.setTextColor(30);
    var lines = doc.splitTextToSize(value || ' ', contentW);
    doc.text(lines[0] || ' ', margin, y);
    doc.setDrawColor(130);
    doc.setLineWidth(0.5);
    doc.line(margin, y + 3, margin + contentW, y + 3);
    y += 20;
    doc.setDrawColor(0);
  }

  function inlineFields(fields) {
    checkPage(32);
    var totalGap = 12 * (fields.length - 1);
    var usedFixed = fields.reduce(function(a, f) { return a + (f.fixedW || 0); }, 0);
    var flexCount = fields.filter(function(f) { return !f.fixedW; }).length;
    var flexW = flexCount > 0 ? (contentW - usedFixed - totalGap) / flexCount : 0;
    var x = margin;
    var startY = y;
    fields.forEach(function(f) {
      var w = f.fixedW || flexW;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(f.label.toUpperCase(), x, startY);
      doc.setFontSize(10.5);
      doc.setTextColor(30);
      var lines = doc.splitTextToSize(f.value || ' ', w - 2);
      doc.text(lines[0] || ' ', x, startY + 11);
      doc.setDrawColor(130);
      doc.setLineWidth(0.5);
      doc.line(x, startY + 14, x + w, startY + 14);
      doc.setDrawColor(0);
      x += w + 12;
    });
    y = startY + 30;
  }

  function textBlock(label, text) {
    checkPage(40);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(label.toUpperCase(), margin, y);
    y += 12;
    doc.setFontSize(10.5);
    doc.setTextColor(30);
    var lines = doc.splitTextToSize(text || ' ', contentW);
    lines.forEach(function(line) {
      checkPage(14);
      doc.text(line, margin, y);
      y += 14;
    });
    y += 6;
  }

  function hr() {
    checkPage(14);
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageW - margin, y);
    y += 12;
    doc.setDrawColor(0);
  }

  // PAGE 1: Cover Letter
  drawPageNum(1);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(26, 58, 92);
  doc.text('MICHAEL BURROWS FOUNDATION SCHOLARSHIP', pageW / 2, y, { align: 'center' });
  y += 18;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('Grayville, IL', pageW / 2, y, { align: 'center' });
  y += 8;
  doc.setDrawColor(26, 58, 92);
  doc.setLineWidth(2);
  doc.line(margin, y, pageW - margin, y);
  y += 2;
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 20;
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(30);

  var introText = [
    'Dear Candidate for Graduation:',
    '',
    'Since 2015, the Michael Burrows Foundation has awarded a scholarship to a graduating senior from Grayville High School. This scholarship is completely funded by donations from corporations, individuals, GHS alumni and friends.',
    '',
    'The directors of the Foundation will review the applications and announce the winner at this year\'s high school commencement. Be sure to proofread your application for spelling and grammar.',
    '',
    'Please return the application to your guidance counselor and she will sign the document and list your class rank, grade point average and applicable college scores.'
  ];

  introText.forEach(function(para) {
    if (para === '') { y += 6; return; }
    var lines = doc.splitTextToSize(para, contentW);
    lines.forEach(function(line) { doc.text(line, margin, y); y += 15; });
  });

  y += 10;
  doc.setDrawColor(26, 58, 92);
  doc.setLineWidth(0.75);
  doc.rect(margin, y, contentW, 44);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(26, 58, 92);
  doc.text('Email Completed Form to: Kreid@gcusd.com', pageW / 2, y + 16, { align: 'center' });
  doc.text('All applications must be turned in no later than May 1, 2026', pageW / 2, y + 32, { align: 'center' });
  y += 56;

  // PAGE 2: Application
  doc.addPage();
  y = margin;
  drawPageNum(2);
  sectionHeader('Michael Burrows Foundation\nScholarship Application');

  inlineFields([
    { label: 'First Name', value: val('fname') },
    { label: 'Last Name', value: val('lname') },
    { label: 'Middle Name', value: val('mname'), fixedW: 100 }
  ]);
  inlineFields([
    { label: 'Street Address', value: val('street') },
    { label: 'City', value: val('city') },
    { label: 'ZIP', value: val('zip'), fixedW: 70 }
  ]);
  inlineFields([
    { label: 'Date of Birth', value: val('dob'), fixedW: 130 },
    { label: 'Phone Number', value: val('phone') }
  ]);
  fieldLine('Name of Parents or Guardians', val('parents'));
  hr();
  fieldLine('Interest in Continuing Education?', val('interest'));
  fieldLine('Level of Education That You Aspire to Obtain', val('edu_level'));
  fieldLine('School You Will Be Attending', val('school'));
  fieldLine('Scholarships Applied For', val('schol_applied'));
  fieldLine('Scholarships Received', val('schol_received'));
  hr();
  textBlock('In what civic/religious activities (not related to school) have you participated?', val('civic'));
  textBlock('In what school activities/clubs/organizations have you participated?', val('school_activities'));
  textBlock('List the honors that you have received (include both school and non-school)', val('honors'));

  // PAGE 3: Narrative
  doc.addPage();
  y = margin;
  drawPageNum(3);
  sectionHeader('Michael Burrows Foundation Scholarship\nNarrative');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(30);
  var narrativeIntro = 'Please type a one-page narrative describing your future educational plans, a summary telling us about yourself, your future aspirations and the reason why you should be chosen as the recipient of this scholarship.';
  var niLines = doc.splitTextToSize(narrativeIntro, contentW);
  niLines.forEach(function(line) { doc.text(line, margin, y); y += 15; });
  y += 10;

  var narLines = doc.splitTextToSize(val('narrative') || ' ', contentW);
  narLines.forEach(function(line) {
    checkPage(14);
    doc.text(line, margin, y);
    y += 14;
  });

  // PAGE 4: Signatures
  doc.addPage();
  y = margin;
  drawPageNum(4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(30);
  var p4intro = 'Final selection for this scholarship may be asked to submit a cover letter to help with the selection process.';
  doc.splitTextToSize(p4intro, contentW).forEach(function(l) { doc.text(l, margin, y); y += 15; });
  y += 10;
  hr();

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10.5);
  doc.text('I hereby certify that the statements herein are true and correct to the best of my knowledge.', margin, y);
  y += 20;

  inlineFields([
    { label: 'Signature', value: val('sig1') },
    { label: 'Date', value: val('date1'), fixedW: 110 }
  ]);
  hr();

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(30);
  var consentName = val('consent_name') || '___________________________';
  var consentText = 'I ' + consentName + ' give consent to the Michael Burrows Foundation to obtain information and make inquiries needed to verify the information I have submitted to the foundation program under the laws of the state of Illinois, IRS code and related regulations.';
  doc.splitTextToSize(consentText, contentW).forEach(function(l) { doc.text(l, margin, y); y += 15; });
  y += 10;

  inlineFields([
    { label: 'Signature', value: val('sig2') },
    { label: 'Date', value: val('date2'), fixedW: 110 }
  ]);

  // PAGE 5: Counselor
  doc.addPage();
  y = margin;
  drawPageNum(5);
  sectionHeader('Michael Burrows Foundation Scholarship\nTo Be Completed by Guidance Counselor');

  inlineFields([
    { label: 'Year Graduating', value: val('grad_year') },
    { label: 'High School Class Rank', value: val('class_rank') },
    { label: 'High School GPA', value: val('gpa') }
  ]);
  inlineFields([
    { label: 'ACT Score', value: val('act') },
    { label: 'SAT Score', value: val('sat') }
  ]);
  y += 10;
  fieldLine('Guidance Counselor Signature', val('counselor_sig'));

  var fname = val('fname') || 'Application';
  var lname = val('lname') ? '_' + val('lname') : '';
  doc.save('MichaelBurrowsFoundation_' + fname + lname + '.pdf');
}
