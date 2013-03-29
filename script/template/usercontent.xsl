<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="passage">
        <div class="passage well">
            <span class="reference">Reference: <xsl:apply-templates select="reference"/></span>
            <div class="note">Notes: <xsl:apply-templates select="note"/></div>
            Tags: <div class="pagination"><ul class="tags"><xsl:apply-templates select="tag"/></ul></div>
            <div class="actions">
                <a href="#" class="btn btn-danger btn-small">Delete</a>
                <a href="#" class="btn btn-success btn-small">Save</a>
            </div>
        </div>
    </xsl:template>

    <xsl:template match="reference">
        <xsl:apply-templates select="startBookId"/>:<xsl:apply-templates select="startChapter"/>:<xsl:apply-templates select="startVerse"/>(<xsl:apply-templates select="startIndex"/>)
        -
        <xsl:apply-templates select="endBookId"/>:<xsl:apply-templates select="endChapter"/>:<xsl:apply-templates select="endVerse"/>(<xsl:apply-templates select="endIndex"/>)
    </xsl:template>

    <xsl:template match="note">
        [<xsl:apply-templates select="content"/>] 
    </xsl:template>
    
    <xsl:template match="tag">
        <li class="tag"><a href="#"><xsl:apply-templates select="content"/></a></li>
    </xsl:template>

</xsl:stylesheet>