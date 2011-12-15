<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="note">
        <div class="note">
            <h4>
                note: <xsl:apply-templates select="startChapter"/>:<xsl:apply-templates select="startVerse"/>
                 - 
                <xsl:apply-templates select="endChapter"/>:<xsl:apply-templates select="endVerse"/>
            </h4>

            <span class="content"><xsl:apply-templates select="content"/></span>
        </div>
    </xsl:template>

    <xsl:template match="tag">
        <div class="tag">
            <h4>
                tag: <xsl:apply-templates select="startChapter"/>:<xsl:apply-templates select="startVerse"/>
                 - 
                <xsl:apply-templates select="endChapter"/>:<xsl:apply-templates select="endVerse"/>
            </h4>

            <span class="content"><xsl:apply-templates select="content"/></span>
        </div>
    </xsl:template>

</xsl:stylesheet>