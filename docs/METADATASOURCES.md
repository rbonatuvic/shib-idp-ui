# Metdata Sources

Metadata sources in the UI are individual metadata artifacts describing single entities, typically
relying parties. There are 2 ways to access these artifacts.

1. MDQ

    _To be written_
    
2. File export

    Files can be periodically written to disk. Define the application property `shibui.metadata-dir`,
    and the files will be written out by default every 30 seconds. Note that there is no default value
    set for this property and no file will be written by default. To change the run rate, set the
    `shibui.taskRunRate` application property, in milliseconds.