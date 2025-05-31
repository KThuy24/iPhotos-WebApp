import React from 'react';

function Footer() { 
  const footerStyle = {
    backgroundColor: '#343a40', // Màu nền tối (giống bg-dark của Bootstrap)
    color: 'white',             // Chữ màu trắng
    textAlign: 'center',
    padding: '1rem 0',          // Padding trên dưới
  };

  return (
    <footer style={footerStyle}>
      CREATE BY NHN & NKT
    </footer>
  );
}

export default Footer;