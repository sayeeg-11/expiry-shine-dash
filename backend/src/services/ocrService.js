// const axios = require('axios');

// class OCRService {
//   // Extract text from image using OCR.space API
//   async extractTextFromImage(imageUrl) {
//     try {
//       console.log('OCR: Processing image URL:', imageUrl);
      
//       const formData = new URLSearchParams();
//       formData.append('url', imageUrl);
//       formData.append('language', 'eng');
//       formData.append('isOverlayRequired', 'false');
//       formData.append('detectOrientation', 'true');
//       formData.append('scale', 'true');
      
//       const response = await axios.post('https://api.ocr.space/parse/imageurl', formData, {
//         headers: {
//           'apikey': 'helloworld', // Free API key
//           'Content-Type': 'application/x-www-form-urlencoded'
//         }
//       });
      
//       console.log('OCR Response status:', response.data?.OCRExitCode);

//       if (response.data.ParsedResults && response.data.ParsedResults.length > 0) {
//         const text = response.data.ParsedResults[0].ParsedText;
//         console.log('OCR extracted text:', text);
//         return text;
//       }
      
//       console.log('No text found in OCR results');
//       return null;
//     } catch (error) {
//       console.log('OCR extraction failed:', error.message);
//       return null;
//     }
//   }






// const axios = require('axios');
// const FormData = require('form-data');

// class OCRService {
//   // Extract text from image using OCR.space API
//   async extractTextFromImage(imageUrl) {
//     try {
//       console.log('OCR: Processing image URL:', imageUrl);

//       const formData = new FormData();
//       formData.append('apikey', 'helloworld'); // Free API key
//       formData.append('language', 'eng');
//       formData.append('isOverlayRequired', 'false');
//       formData.append('detectOrientation', 'true');
//       formData.append('scale', 'true');

//       // For remote image (Cloudinary, etc.)
//       formData.append('url', imageUrl);

//       const response = await axios.post(
//         'https://api.ocr.space/parse/image',
//         formData,
//         { headers: formData.getHeaders() }
//       );

//       console.log('OCR Response status:', response.data?.OCRExitCode);

//       if (response.data.ParsedResults && response.data.ParsedResults.length > 0) {
//         const text = response.data.ParsedResults[0].ParsedText;
//         console.log('OCR extracted text:', text);
//         return text;
//       }

//       console.log('No text found in OCR results');
//       return null;
//     } catch (error) {
//       console.log('OCR extraction failed:', error.message);
//       return null;
//     }
//   }





//   // Clean noisy OCR text before extraction
//   cleanOCRText(text) {
//     if (!text) return '';

//     return text
//       .replace(/O/g, '0')    // O → 0
//       .replace(/S/g, '5')    // S → 5
//       .replace(/I/g, '1')    // I → 1
//       .replace(/[^A-Z0-9\/\-\.\s]/gi, '') // remove junk
//       .replace(/\s+/g, ' ')  // normalize spaces
//       .trim();
//   }






//   // Extract barcode from OCR text
//   extractBarcodeFromText(text) {
//     if (!text) return null;
    
//     const patterns = [
//       /\b\d{13}\b/g,     // EAN-13 barcodes (most common)
//       /\b\d{12}\b/g,     // UPC barcodes
//       /\b\d{14}\b/g,     // GTIN-14
//       /\b\d{8}\b/g,      // EAN-8 barcodes
//     ];

//     for (const pattern of patterns) {
//       const matches = text.match(pattern);
//       if (matches && matches.length > 0) {
//         console.log('Barcode found:', matches[0]);
//         return matches[0];
//       }
//     }

//     return null;
//   }

//   // Extract expiry date from OCR text
//   extractExpiryDate(text) {
//     if (!text) return null;
    
//     // const patterns = [
//     //   /(EXP|Expiry|Best Before|Use By|BB|Exp Date)[:\s]*([0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4})/i,
//     //   /(EXP|Expiry|Best Before|Use By|BB)[:\s]*([0-9]{1,2}[\/\-\.][0-9]{4})/i,
//     //   /([0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4})/g,
//     //   /([0-9]{2}[\/\-\.][0-9]{4})/g
//     // ];

//     const patterns = [
//     /(EXP|Expiry|Best Before|Use By|BB|Exp Date)[:\s]*([0-9]{1,2}[\- ]?(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[\- ]?[0-9]{2,4})/i,
//     /([0-9]{1,2}[\- ]?(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[\- ]?[0-9]{2,4})/i,
//     /([0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4})/g,
//     /([0-9]{2}[\/\-\.][0-9]{4})/g
//   ];

//     for (const pattern of patterns) {
//       const matches = text.match(pattern);
//       if (matches) {
//         const dateStr = matches[matches.length - 1]; // Get the date part
//         const parsedDate = this.parseDate(dateStr);
//         if (parsedDate) {
//           console.log('Expiry date found:', parsedDate);
//           return parsedDate;
//         }
//       }
//     }

//     return null;
//   }

//   // Parse date string to ISO format
//   // parseDate(dateStr) {
//   //   try {
//   //     // Handle different date formats
//   //     const formats = [
//   //       /^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/, // DD/MM/YYYY or MM/DD/YYYY
//   //       /^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2})$/, // DD/MM/YY or MM/DD/YY
//   //       /^(\d{2})[\/\-\.](\d{4})$/ // MM/YYYY
//   //     ];

//   //     for (const format of formats) {
//   //       const match = dateStr.match(format);
//   //       if (match) {
//   //         let day, month, year;
          
//   //         if (match[3]) { // Full date
//   //           day = parseInt(match[1]);
//   //           month = parseInt(match[2]);
//   //           year = parseInt(match[3]);
            
//   //           if (year < 100) year += 2000; // Convert YY to YYYY
            
//   //           // Assume DD/MM/YYYY format for most products
//   //           if (day > 12) {
//   //             [day, month] = [month, day]; // Swap if day > 12
//   //           }
//   //         } else { // MM/YYYY format
//   //           day = 1; // Default to first day of month
//   //           month = parseInt(match[1]);
//   //           year = parseInt(match[2]);
//   //         }
          
//   //         const date = new Date(year, month - 1, day);
//   //         if (!isNaN(date.getTime())) {
//   //           return date.toISOString().split('T')[0];
//   //         }
//   //       }
//   //     }
//   //   } catch (error) {
//   //     console.log('Date parsing error:', error.message);
//   //   }
    
//   //   return null;
//   // }





// parseDate(dateStr) {
//   try {
//     const monthMap = {
//       JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
//       JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
//     };

//     // Match DD-MMM-YY or DD-MMM-YYYY
//     const textMonth = dateStr.match(/^(\d{1,2})[\- ]?(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[\- ]?(\d{2,4})$/i);
//     if (textMonth) {
//       let day = parseInt(textMonth[1]);
//       let month = monthMap[textMonth[2].toUpperCase()];
//       let year = parseInt(textMonth[3]);
//       if (year < 100) year += 2000; // Convert YY → YYYY
//       const date = new Date(year, month, day);
//       if (!isNaN(date.getTime())) {
//         return date.toISOString().split('T')[0];
//       }
//     }

//     // Existing numeric parsing logic...
//     const formats = [
//       /^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/,
//       /^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2})$/,
//       /^(\d{2})[\/\-\.](\d{4})$/
//     ];

//     for (const format of formats) {
//       const match = dateStr.match(format);
//       if (match) {
//         let day, month, year;
//         if (match[3]) {
//           day = parseInt(match[1]);
//           month = parseInt(match[2]);
//           year = parseInt(match[3]);
//           if (year < 100) year += 2000;
//           if (day > 12) [day, month] = [month, day];
//         } else {
//           day = 1;
//           month = parseInt(match[1]);
//           year = parseInt(match[2]);
//         }
//         const date = new Date(year, month - 1, day);
//         if (!isNaN(date.getTime())) {
//           return date.toISOString().split('T')[0];
//         }
//       }
//     }
//   } catch (error) {
//     console.log('Date parsing error:', error.message);
//   }

//   return null;
// }







//   // // Main scan function that extracts everything
//   // async scanImage(imageUrl) {
//   //   const text = await this.extractTextFromImage(imageUrl);
    
//   //   if (!text) {
//   //     return {
//   //       text: null,
//   //       barcode: null,
//   //       expiryDate: null
//   //     };
//   //   }

//   //   const barcode = this.extractBarcodeFromText(text);
//   //   const expiryDate = this.extractExpiryDate(text);

//   //   return {
//   //     text,
//   //     barcode,
//   //     expiryDate
//   //   };
//   // }



//     async scanImage(imageUrl) {
//     const rawText = await this.extractTextFromImage(imageUrl);
    
//     if (!rawText) {
//       return {
//         text: null,
//         barcode: null,
//         expiryDate: null
//       };
//     }

//     // ✅ Clean the OCR text before extraction
//     const text = this.cleanOCRText(rawText);

//     const barcode = this.extractBarcodeFromText(text);
//     const expiryDate = this.extractExpiryDate(text);

//     return {
//       rawText,   // keep original for debugging
//       text,      // cleaned text
//       barcode,
//       expiryDate
//     };
//   }

// }

// module.exports = new OCRService();






const axios = require('axios');
const FormData = require('form-data');

class OCRService {
  // Extract text from image using OCR.space API
  async extractTextFromImage(imageUrl) {
    try {
      console.log('OCR: Processing image URL:', imageUrl);

      const formData = new FormData();
      formData.append('apikey', 'helloworld'); // Free API key
      formData.append('language', 'eng');
      formData.append('isOverlayRequired', 'false');
      formData.append('detectOrientation', 'true');
      formData.append('scale', 'true');
      formData.append('url', imageUrl);

      const response = await axios.post(
        'https://api.ocr.space/parse/image',
        formData,
        { headers: formData.getHeaders() }
      );

      console.log('OCR Response status:', response.data?.OCRExitCode);

      if (response.data.ParsedResults && response.data.ParsedResults.length > 0) {
        const text = response.data.ParsedResults[0].ParsedText;
        console.log('OCR extracted text:', text);
        return text;
      }

      console.log('No text found in OCR results');
      return null;
    } catch (error) {
      console.log('OCR extraction failed:', error.message);
      return null;
    }
  }

  // Clean noisy OCR text before extraction
  cleanOCRText(text) {
    if (!text) return '';
    return text
      .replace(/O/g, '0')    // O → 0
      .replace(/S/g, '5')    // S → 5
      .replace(/I/g, '1')    // I → 1
    .replace(/[^A-Z0-9\/\-\.\s]/gi, '') // keep only useful chars
    .replace(/(\d)\s+(\d)/g, '$1$2') // keep only useful chars
      .replace(/\s+/g, ' ')
      .trim();
  }

fixExpiryText(str) {
  if (!str) return str;

  // Convert "3 .NOV.25" → "30 NOV 25"
 str = str.replace(/\s+/g, ' ');

  // Fix common OCR mistakes
  str = str.replace(/2S/g, '25');   // 2S → 25
  str = str.replace(/5EP/g, 'SEP'); // 5EP → SEP
  str = str.replace(/N0V/g, 'NOV'); // N0V → NOV
str = str.replace(/0CT/g, 'OCT'); // 0CT → OCT
  str = str.replace(/^3\s*\.?\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\.?(\d{2})$/i, '30 $1 $2');

  return str.trim();
}


  // Extract barcode from OCR text
  extractBarcodeFromText(text) {
    if (!text) return null;

    // Look for long digit sequences (with optional spaces)
    const pattern = /\d[\d\s]{7,20}\d/g;
    const matches = text.match(pattern);

    if (matches) {
      for (let candidate of matches) {
        candidate = candidate.replace(/\s+/g, ''); // remove spaces
        if (candidate.length >= 8 && candidate.length <= 14) {
          console.log('Barcode found (fixed):', candidate);
          return candidate;
        }
      }
    }
    return null;
  }






  // Extract expiry date from OCR text
  extractExpiryDate(text) {
    if (!text) return null;

    const patterns = [
      /(EXP|Expiry|Best Before|Use By|BB|Exp Date)[:\s]*([0-9]{1,2}[\- .]?(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[\- .]?[0-9]{2,4})/i,
      /([0-9]{1,2}[\- .]?(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[\- .]?[0-9]{2,4})/i,
      /([0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4})/g,
      /([0-9]{2}[\/\-\.][0-9]{4})/g
    ];

    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        const dateStr = matches[matches.length - 1];
        const parsedDate = this.parseDate(dateStr);
        if (parsedDate) {
          console.log('Expiry date found:', parsedDate);
          return parsedDate;
        }
      }
    }
    return null;
  }

  // Parse date string to ISO format
  parseDate(dateStr) {
    try {
      const monthMap = {
        JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
        JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
      };

      // Normalize
      dateStr = dateStr.replace(/\s+/g, '').toUpperCase();

      // Match DD-MMM-YY or DD-MMM-YYYY
      const textMonth = dateStr.match(/^(\d{1,2})[.\- ]?(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[.\- ]?(\d{2,4})$/i);
      if (textMonth) {
        let day = parseInt(textMonth[1]);
        let month = monthMap[textMonth[2].toUpperCase()];
        let year = parseInt(textMonth[3]);
        if (year < 100) year += 2000;
        const date = new Date(year, month, day);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      }

      // Fallback numeric formats
      const formats = [
        /^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/,
        /^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2})$/,
        /^(\d{2})[\/\-\.](\d{4})$/
      ];

      for (const format of formats) {
        const match = dateStr.match(format);
        if (match) {
          let day, month, year;
          if (match[3]) {
            day = parseInt(match[1]);
            month = parseInt(match[2]);
            year = parseInt(match[3]);
            if (year < 100) year += 2000;
            if (day > 12) [day, month] = [month, day];
          } else {
            day = 1;
            month = parseInt(match[1]);
            year = parseInt(match[2]);
          }
          const date = new Date(year, month - 1, day);
          if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
          }
        }
      }
    } catch (error) {
      console.log('Date parsing error:', error.message);
    }
    return null;
  }

  // Main scan
  async scanImage(imageUrl) {
    const rawText = await this.extractTextFromImage(imageUrl);
    if (!rawText) {
      return { text: null, fixedRaw: null,barcode: null, expiryDate: null };
    }
let fixedRaw = this.fixExpiryText(rawText);
//const text = this.cleanOCRText(fixedRaw);

    const text = this.cleanOCRText( fixedRaw);
    const barcode = this.extractBarcodeFromText(text);
    const expiryDate = this.extractExpiryDate(text);
      console.log("RAW OCR:", rawText);
  console.log("FIXED RAW:", fixedRaw);
  console.log("CLEANED:", text);
  console.log("BARCODE:", barcode);
  console.log("EXPIRY:", expiryDate);


    return { rawText,  fixedRaw,text, barcode, expiryDate };
  }
}

module.exports = new OCRService();


