<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="chapter">
        <div class="chapter" ref="{@book}_{@n}">
            <h4>Chapter <xsl:value-of select="@n"/></h4>
            <xsl:apply-templates select="verse"/>
        </div>
    </xsl:template>

    <xsl:template match="verse">
        <span class="verse" ref="{../@book}_{../@n}_{position()}">
            <span class="n"><xsl:value-of select="position()"/></span>
            <xsl:value-of select="."/>
        </span>
    </xsl:template>

</xsl:stylesheet>