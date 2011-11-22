<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="chapter">
        <div class="chapter" ref="{@book} {@n}" translation="{@translation}" book="{@book}">
            <xsl:apply-templates select="verse"/>
        </div>
    </xsl:template>

    <xsl:template match="verse">
        <span class="verse" ref="{../@book} {../@n}:{position()}">
            <span class="n"><xsl:value-of select="position()"/></span>
            <xsl:value-of select="."/>
        </span>
    </xsl:template>

</xsl:stylesheet>