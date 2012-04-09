<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="passage">
        <div class="passage">
            <span class="reference"><xsl:apply-templates select="reference"/></span>
            <span class="note"><xsl:apply-templates select="note"/></span>
            <span class="tags"><xsl:apply-templates select="tag"/></span>
        </div>
    </xsl:template>

    <xsl:template match="reference">

    </xsl:template>

    <xsl:template match="note">
        [<xsl:apply-templates select="content"/>] 
    </xsl:template>
    
    <xsl:template match="tag">
        [<xsl:apply-templates select="content"/>] 
    </xsl:template>

</xsl:stylesheet>