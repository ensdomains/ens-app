import React from 'react'

export default function MigrationWarning() {
  return (
    <div>
      The parent of this subdomain (yourname.eth) needs to migrate their
      resolver. Until they do so, this name can not be used or traded.
    </div>
  )
}
