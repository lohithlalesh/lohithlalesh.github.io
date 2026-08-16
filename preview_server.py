#!/usr/bin/env python3
"""Local preview server with Cloudflare Pages style clean HTML routes."""

from __future__ import annotations

import argparse
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path, PurePosixPath
from urllib.parse import unquote, urlsplit
import webbrowser


ROOT = Path(__file__).resolve().parent


class CleanURLHandler(SimpleHTTPRequestHandler):
    """Serve /path from /path.html while preserving static asset routes."""

    def translate_path(self, path: str) -> str:
        url_path = unquote(urlsplit(path).path)
        parts = [part for part in PurePosixPath(url_path).parts if part not in ("/", ".", "..")]
        candidate = ROOT.joinpath(*parts)

        if candidate.exists():
            return str(candidate)

        if not candidate.suffix:
            html_candidate = candidate.with_suffix(".html")
            if html_candidate.is_file():
                return str(html_candidate)

        return str(candidate)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Preview the MOTTO website locally.")
    parser.add_argument("--port", type=int, default=4175, help="Preferred local port")
    parser.add_argument("--open", action="store_true", help="Open the preview in your default browser")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    os.chdir(ROOT)

    server = None
    for port in range(args.port, args.port + 15):
        try:
            server = ThreadingHTTPServer(("127.0.0.1", port), CleanURLHandler)
            break
        except OSError:
            continue

    if server is None:
        raise SystemExit("No available preview port was found.")

    url = f"http://127.0.0.1:{server.server_port}/"
    print(f"MOTTO preview is running at {url}")
    print("Press Control+C to stop the preview server.")
    if args.open:
        webbrowser.open(url)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nPreview stopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
