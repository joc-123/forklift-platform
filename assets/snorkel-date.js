'use strict';
(function () {
  const source = 'https://snorkellifts.com/the-toolbox/how-to-read-snorkel-serial-plates/';
  function interpretSnorkel(serial) {
    const unknown = reason => ({status:'unknown', manufactureYear:null, manufactureMonth:null, reason, source});
    if (typeof serial !== 'string') return unknown('Enter the full serial exactly as printed.');
    // Deliberately no trimming, separator rewriting, century pivot or legacy fallback.
    const match = /^S3370RT-07-(\d{2})(\d{2})(\d{5})$/.exec(serial);
    if (!match) return unknown('This format is outside the documented S3370RT / plant 07 layout supported here.');
    const month = Number(match[2]);
    if (month < 1 || month > 12) return unknown('The month component must be 01–12.');
    if (match[1] !== '17') return unknown('The source explicitly establishes 17 as 2017; no general century rule is established here.');
    return {status:'format_interpretation', manufactureYear:2017, manufactureMonth:month, source,
      reason:'Interpretation of the documented S3370RT / plant 07 layout. Confirm that this layout applies and compare with the machine’s manufacture-date plate. Legacy adoption bounds are unknown; this is not an independently verified machine date.'};
  }
  function mount(doc) {
    const input = doc.getElementById('snorkel-serial');
    const output = doc.getElementById('snorkel-result');
    input.addEventListener('input', () => { output.textContent = 'Input changed. Check the full serial again.'; });
    doc.getElementById('snorkel-check').addEventListener('click', () => {
      const result = interpretSnorkel(input.value);
      output.textContent = result.status === 'unknown' ? 'Year not yet verified. ' + result.reason :
        'Documented-format interpretation: ' + result.manufactureYear + '-' + String(result.manufactureMonth).padStart(2,'0') + '. ' + result.reason;
    });
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {interpretSnorkel, mount};
  else mount(document);
})();
