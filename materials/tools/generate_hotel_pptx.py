# -*- coding: utf-8 -*-
"""Generate Hotel.pptx presentation.

Routes directly to generate_hotel_pptx_vivid.py which incorporates
Irasutoya illustrations, Hero Card vocabulary layouts, and full-body character
dialogue scene layouts with speech bubbles.
"""

import os
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding='utf-8')

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
VIVID_SCRIPT = os.path.join(SCRIPT_DIR, "generate_hotel_pptx_vivid.py")

if __name__ == "__main__":
    from generate_hotel_pptx_vivid import main
    main()
