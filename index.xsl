<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="/">
        <html><body>
            <xsl:apply-templates select="book"/>
        </body></html>
    </xsl:template>


    <xsl:template match="book">
        <div class="book">
            <h1>The <xsl:value-of select="@translation"/> Bible</h1>
            <h2>The <xsl:value-of select="@testament"/> Testament</h2>
            <h3>The Book of <xsl:value-of select="@name"/></h3>
            <xsl:apply-templates select="chapter"/>
        </div>
    </xsl:template>


    <xsl:template match="chapter">
        <div class="chapter">
            <h4>Chapter <xsl:value-of select="position()"/></h4>
            <xsl:apply-templates select="verse"/>
        </div>
    </xsl:template>


    <xsl:template match="verse">
        <span class="verse">
            <xsl:value-of select="position()"/>
            <xsl:value-of select="."/>
        </span>
    </xsl:template>

</xsl:stylesheet>