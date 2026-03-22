from core_engine.config import Config
from core_engine.log import Logger
from core_engine.database import Database

class CoreEngine:
    def __init__(self, config: Config):
        self.config = config
        self.logger = Logger(config.log_level)
        self.db = Database(config.database_url)

    def run(self):
        self.logger.info("Starting core engine...")
        if not self.db.connect():
            self.logger.error("Failed to connect to database.")
            return False
        self.logger.info("Connected to database.")
        # More code here...
        return True

def main():
    config = Config()

    try:
        core = CoreEngine(config)
        if not core.run():
            return 1
    except Exception as e:
        Logger(config.log_level).error(str(e))
        return 1

    return 0

if __name__ == "__main__":
    import sys
    sys.exit(main())