<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="passage">
        <div class="passage">
            <span class="reference"><xsl:apply-templates select="reference"/></span>
            <div class="note"><xsl:apply-templates select="note"/></div>
            <div class="tags"><a href="#newtag">[ + ]</a><xsl:apply-templates select="tag"/></div>
            <div class="actions">[ delete ] [ save ]</div>
        </div>
    </xsl:template>

    <xsl:template match="reference">

    </xsl:template>

    <xsl:template match="note">
        [<xsl:apply-templates select="content"/>] 
    </xsl:template>
    
    <xsl:template match="tag">
        <span class="tag"><xsl:apply-templates select="content"/></span>
    </xsl:template>

</xsl:stylesheet>