class AnyRORError(Exception):
    """Base exception for all AnyROR scraper domain errors."""
    pass

class CaptchaSolveError(AnyRORError):
    """Raised when CAPTCHA inference fails or retries are exhausted."""
    pass

class ScrapingTimeoutError(AnyRORError):
    """Raised when navigation or element waiting times out."""
    pass

class RecordNotFoundError(AnyRORError):
    """Raised when AnyROR explicitly reports 'No record found'."""
    pass

class ParsingError(AnyRORError):
    """Raised when HTML structural extraction fails."""
    pass

class AnyRoROfflineError(AnyRORError):
    """Raised when AnyRoR government portal is offline or in maintenance."""
    pass

class AnyRoRBlockedError(AnyRORError):
    """Raised when AnyRoR server actively closes/rejects connections due to IP rate limits or firewall rules."""
    pass