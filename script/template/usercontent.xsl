<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="passage">
        <div class="passage">
            <span class="reference"><xsl:apply-templates select="reference"/></span>
            <span class="note"><xsl:apply-templates select="note/content"/></span>
            <span class="tags"><xsl:apply-templates select="tag/content"/></span>
        </div>
    </xsl:template>

</xsl:stylesheet>