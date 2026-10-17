'use strict';
(function () {
  const rules = [
  {
    "models": [
      "GS-1530",
      "GS-1532",
      "GS-1930",
      "GS-1932"
    ],
    "start": "GS3011C-10000",
    "end": "GS3016C-23999",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/1272217.pdf",
    "pages": [
      2,
      5
    ]
  },
  {
    "models": [
      "GS-1530",
      "GS-1532",
      "GS-1930",
      "GS-1932"
    ],
    "start": "GS3016P-151487",
    "end": "GS3016P-160599",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/1272217.pdf",
    "pages": [
      2,
      5
    ]
  },
  {
    "models": [
      "GS-1530",
      "GS-1532",
      "GS-1930",
      "GS-1932"
    ],
    "start": "GS30D-6080",
    "end": "GS30D-40100",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/1272217.pdf",
    "pages": [
      2,
      5
    ]
  },
  {
    "models": [
      "GS-1530",
      "GS-1532",
      "GS-1930",
      "GS-1932"
    ],
    "start": "GS30P-160600",
    "end": "GS30P-200100",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/1272217.pdf",
    "pages": [
      2,
      5
    ]
  },
  {
    "models": [
      "GS-2032",
      "GS-2632",
      "GS-3232"
    ],
    "start": "GS3212C-10000",
    "end": "GS3216C-17299",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/1272217.pdf",
    "pages": [
      2,
      5
    ]
  },
  {
    "models": [
      "GS-2032",
      "GS-2632",
      "GS-3232"
    ],
    "start": "GS3216P-142676",
    "end": "GS3216P-148699",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/1272217.pdf",
    "pages": [
      2,
      5
    ]
  },
  {
    "models": [
      "GS-2032",
      "GS-2632",
      "GS-3232"
    ],
    "start": "GS32D-101",
    "end": "GS32D-10100",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/1272217.pdf",
    "pages": [
      2,
      5
    ]
  },
  {
    "models": [
      "GS-2032",
      "GS-2632",
      "GS-3232"
    ],
    "start": "GS32P-148700",
    "end": "GS32P-200100",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/1272217.pdf",
    "pages": [
      2,
      5
    ]
  },
  {
    "models": [
      "GS-2046",
      "GS-2646",
      "GS-3246"
    ],
    "start": "GS4612C-10000",
    "end": "GS4616C-18099",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/1272217.pdf",
    "pages": [
      2,
      5
    ]
  },
  {
    "models": [
      "GS-2046",
      "GS-2646",
      "GS-3246"
    ],
    "start": "GS4614D-101",
    "end": "GS4616D-5029",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/1272217.pdf",
    "pages": [
      2,
      5
    ]
  },
  {
    "models": [
      "GS-2046",
      "GS-2646",
      "GS-3246"
    ],
    "start": "GS4616P-138362",
    "end": "GS4616P-141799",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/1272217.pdf",
    "pages": [
      2,
      5
    ]
  },
  {
    "models": [
      "GS-2046",
      "GS-2646",
      "GS-3246"
    ],
    "start": "GS46D-5030",
    "end": "GS46D-20100",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/1272217.pdf",
    "pages": [
      2,
      5
    ]
  },
  {
    "models": [
      "GS-2046",
      "GS-2646",
      "GS-3246"
    ],
    "start": "GS46P-141800",
    "end": "GS46P-200100",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/1272217.pdf",
    "pages": [
      2,
      5
    ]
  },
  {
    "models": [
      "GS-4047"
    ],
    "start": "GS4712C-101",
    "end": "GS4716C-4499",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/1272217.pdf",
    "pages": [
      2,
      5
    ]
  },
  {
    "models": [
      "GS-4047"
    ],
    "start": "GS4714D-101",
    "end": "GS4716D-3959",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/1272217.pdf",
    "pages": [
      2,
      5
    ]
  },
  {
    "models": [
      "GS-4047"
    ],
    "start": "GS4716P-101",
    "end": "GS4716P-999",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/1272217.pdf",
    "pages": [
      2,
      5
    ]
  },
  {
    "models": [
      "GS-1530",
      "GS-1532",
      "GS-1930",
      "GS-1932"
    ],
    "start": "GS3005A-76000",
    "end": "GS3011A-109999",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/97385.pdf",
    "pages": [
      1,
      3
    ]
  },
  {
    "models": [
      "GS-1530",
      "GS-1532",
      "GS-1930",
      "GS-1932"
    ],
    "start": "GS3005B-76000",
    "end": "GS3009B-98941",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/97385.pdf",
    "pages": [
      1,
      3
    ]
  },
  {
    "models": [
      "GS-1530",
      "GS-1532",
      "GS-1930",
      "GS-1932"
    ],
    "start": "GS3008C-101",
    "end": "GS3011C-9999",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/97385.pdf",
    "pages": [
      1,
      3
    ]
  },
  {
    "models": [
      "GS-2032",
      "GS-2632",
      "GS-3232"
    ],
    "start": "GS3205-75407",
    "end": "GS3209-94602",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/97385.pdf",
    "pages": [
      1,
      3
    ]
  },
  {
    "models": [
      "GS-2032",
      "GS-2632",
      "GS-3232"
    ],
    "start": "GS3209A-94603",
    "end": "GS3212A-109999",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/97385.pdf",
    "pages": [
      1,
      3
    ]
  },
  {
    "models": [
      "GS-2032",
      "GS-2632",
      "GS-3232"
    ],
    "start": "GS3205B-76000",
    "end": "GS3209B-98941",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/97385.pdf",
    "pages": [
      1,
      3
    ]
  },
  {
    "models": [
      "GS-2032",
      "GS-2632",
      "GS-3232"
    ],
    "start": "GS3208C-101",
    "end": "GS3212C-9999",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/97385.pdf",
    "pages": [
      1,
      3
    ]
  },
  {
    "models": [
      "GS-2046",
      "GS-2646",
      "GS-3246"
    ],
    "start": "GS4605-75438",
    "end": "GS4609-95192",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/97385.pdf",
    "pages": [
      1,
      3
    ]
  },
  {
    "models": [
      "GS-2046",
      "GS-2646",
      "GS-3246"
    ],
    "start": "GS4609A-95193",
    "end": "GS4611A-109999",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/97385.pdf",
    "pages": [
      1,
      3
    ]
  },
  {
    "models": [
      "GS-2046",
      "GS-2646",
      "GS-3246"
    ],
    "start": "GS4608C-101",
    "end": "GS4612C-9999",
    "source": "https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/97385.pdf",
    "pages": [
      1,
      3
    ]
  }
];
  function parts(serial) {
    if (typeof serial !== 'string') return null;
    const match = /^(GS(?:30|32|46|47))(\d{2})?([ABCDP])?-(\d{1,6})$/.exec(serial);
    if (!match || match[0] !== serial || /^0/.test(match[4])) return null;
    return {family:match[1], year:match[2] === undefined ? null : Number(match[2]), facility:match[3] || '', sequence:Number(match[4])};
  }
  function interpretGenie(model, serial) {
    const unknown = reason => ({status:'unknown', modelYear:null, manufactureYear:null, manufactureDate:null, reason});
    const p = parts(serial);
    if (!p) return unknown('Enter the exact model and serial as printed. This structure is unsupported.');
    const rule = rules.find(r => {
      if (!r.models.includes(model)) return false;
      const a = parts(r.start), b = parts(r.end);
      return p.family === a.family && p.facility === a.facility && p.sequence >= a.sequence && p.sequence <= b.sequence &&
        (a.year === null ? p.year === null : p.year !== null && p.year >= a.year && p.year <= b.year);
    });
    if (!rule) return unknown('Outside the finite, verified manual scope supported by this checker. Open-ended and disputed ranges remain unsupported.');
    const source = rule.source + '#page=' + rule.pages[1];
    if (p.year === null) return {...unknown('This documented format has no model-year segment. Read the actual year-of-manufacture plate.'), status:'yearless_format', source};
    // Every supported bounded interval is explicitly within 2005–2016.
    if (p.year < 5 || p.year > 16) return unknown('The year component is outside the verified historical era.');
    return {status:'model_year',modelYear:2000+p.year,manufactureYear:null,manufactureDate:null,source,
      reason:'Model-year interpretation within the listed family and manual serial scope. Confirm the exact model on the plate; a family code alone cannot identify it. Manufacture date remains unknown and may differ from model year.'};
  }
  function mount(doc) {
    const model=doc.getElementById('genie-model'), serial=doc.getElementById('genie-serial'), output=doc.getElementById('genie-result');
    for (const input of [model,serial]) input.addEventListener('input',()=>{output.textContent='Input changed. Check the exact model and serial again.';});
    doc.getElementById('genie-check').addEventListener('click',()=>{
      const r=interpretGenie(model.value,serial.value);
      output.textContent=(r.modelYear === null ? 'Model year unavailable from this serial. ' : 'Model year: '+r.modelYear+'. ')+'Manufacture date: unknown. '+r.reason;
      if (r.source) { const a=doc.createElement('a');a.href=r.source;a.textContent=' Official manual legend';output.append(a); }
    });
  }
  if (typeof module !== 'undefined' && module.exports) module.exports={interpretGenie,mount};
  else mount(document);
})();
