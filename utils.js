(function(global){
  function decodeBase64(str){
    if (typeof Buffer !== 'undefined'){
      return Buffer.from(str, 'base64').toString('utf-8');
    }
    return atob(str);
  }

  function renderHTML(doc, html){
    if(!doc || typeof doc.open !== 'function' || typeof doc.write !== 'function' || typeof doc.close !== 'function'){
      throw new Error('Invalid document');
    }
    doc.open();
    doc.write(html);
    doc.close();
  }

  if(typeof module !== 'undefined' && module.exports){
    module.exports = { decodeBase64, renderHTML };
  }else{
    global.decodeBase64 = decodeBase64;
    global.renderHTML = renderHTML;
  }
})(typeof window !== 'undefined' ? window : global);
